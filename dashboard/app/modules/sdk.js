'use strict'

import { getCookie, eraseCookie } from 'apphelpers/cookie'
import { goTo} from 'apphelpers/ma'
import { result } from 'lodash'
import * as axios from 'axios'
import { logInfo } from 'apphelpers/utilities.js'
import { v4 } from 'uuid'

const initiateAbortController = function () {
        if (!AbortController) {
                console.warn('Abort Controller Is Not Supported!')
                return false
        }
        // logInfo('initiate new Abort Controller')
        const signalKey = new Date().getTime()
        const abortCtrl = new AbortController()
        const signal = abortCtrl.signal
        if (!window.controllers) window.controllers = {}
        // logInfo('New Signal Created', signalKey)
        window.controllers[signalKey] = abortCtrl
        return {signalKey, signal}
}

const removeSignal = function (signalKey) {
        if (!window.controllers) return false
        delete window.controllers[signalKey]
        // logInfo('Removing Signal', signalKey)
}

export const serialize = function(obj) {
        let str = []
        for (const p in obj)
                if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
        }
        return str.join("&")
}

export const cancelAllRequest = function () {
        if (!AbortController) {
                console.warn('Abort Controller Is Not Supported!')
                return false
        }
        if (!window.controllers) return false
        const winControllers = window.controllers
        if (winControllers && winControllers.length > 0) {
                for (const controller of winControllers) {
                        logInfo('aborting request...')
                        if (controller) controller.abort()
                }
        }
}

export const p = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
    if (results == null) {
        return null
    } else {
        return results[1] || 0
    }
}

export class Request {
    static get url () {
        return process.env.MIX_API_URL_BASE;
    }
    /* 
    * error: function
    * success: function
    */
    init (error, success) {
        let service = axios.create({
          baseURL: process.env.MIX_PROXY_URL_BASE,
          /* timeout: 1000, */
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token'),
            'X-CBM-REQID': v4()
          }
        })
        service.interceptors.request.use(this.setupTokenAvailable, this.setupTokenNotAvailable)
        service.interceptors.response.use(success || this.handleSuccess, error || this.handleError)
        this.service = service
        return this
    }
    
    setupTokenAvailable (config) {
        const token = getCookie('auth')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    }
    
    setupTokenNotAvailable (error) {
        return Promise.reject (error)
    }
    
    handleSuccess(response) {
        return response.data
    }
    
    handleError(error) {
        /* setup switch for custom error handler */
        let data
        const status = result(error, 'response.status', 0)
        switch (status) {
            case 401: 
                eraseCookie('token')
                eraseCookie('name')
                eraseCookie('userid')
                eraseCookie('refresh')
                goTo('login')
            break
            case 400:
                debugger
                data = error.message
                break
            default:
                // goTo('error-page')
                data = result(error, 'response.data', '')
            break
        }
        return Promise.reject(data)
    }
      
    get(path, query, opt={}) {
        logInfo('[GET]', path)
        let {signalKey, signal} = initiateAbortController()
        return new Promise((resolve, reject) => {
                this.service
                        .request({
                                method: 'GET',
                                url: path,
                                params: query,
                                responseType: 'json',
                                signal,
                                ...opt
                        })
                        .then((res) => {
                                removeSignal(signalKey)
                                resolve(res)
                        })
                        .catch((err) => {
                                reject(err)
                        })
        })
    }
    
    patch(path, payload, opt={}) {
        logInfo('[PATCH]', path)
        return new Promise((resolve, reject) => {
                this.service
                        .request({
                                method: 'PATCH',
                                url: path,
                                responseType: 'json',
                                data: payload
                        })
                        .then((res) => {
                                removeSignal(signalKey)
                                resolve(res)
                        })
                        .catch(reject)
        })
    }
    
    put(path, payload, opt={}) {
        logInfo('[PUT]', path)
        let {signalKey, signal} = initiateAbortController()
        return new Promise((resolve, reject) => {
                this.service
                        .request({
                                method: 'PUT',
                                url: path,
                                responseType: 'json',
                                data: payload
                        })
                        .then((res) => {
                                removeSignal(signalKey)
                                resolve(res)
                        })
                        .catch(reject)
        })
    }
    
    post(path, payload, opt={}) {
        logInfo('[POST]', path)
        let {signalKey, signal} = initiateAbortController()
        return new Promise((resolve, reject) => {
                const options = {
                        method: 'POST',
                        url: path,
                        responseType: 'json',
                        signal,
                        data: payload,
                        ...opt
                }
                this.service
                        .request(options)
                        .then((res) => {
                                removeSignal(signalKey)
                                resolve(res)
                        })
                        .catch(reject)
        })
    }
    
    upload(path, payload, opt={}) {
        logInfo('[POST]', path)
        const form = new FormData()
        form.append('file', payload.file)
        let {signalKey, signal} = initiateAbortController()
        return new Promise((resolve, reject) => {
                const options = {
                        method: 'POST',
                        url: path,
                        signal,
                        data: form,
                        headers: {
                                'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json'
                        },
                        ...opt
                }
                this.service
                        .request(options)
                        .then((res) => {
                                removeSignal(signalKey)
                                resolve(res)
                        })
                        .catch(reject)
        })
    }
}