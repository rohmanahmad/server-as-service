import { app_version } from '../package.json'
import { component, register } from 'riot'
import layout, { layoutComponents } from 'applayout'
import tagModule, { tagComponents } from 'appcomponents'
import module from 'appmodules/index'
import MainLayout from 'applayout/main-layout.riot'
import routes from 'appmodules/all-routes'
import { formatNumber, parseRequestURL } from 'apphelpers/utilities'
import { getCookie } from 'apphelpers/cookie'
import { goTo } from 'apphelpers/ma'
import _ from 'lodash'
import Swal from 'sweetalert2/dist/sweetalert2'
/* plugins app */
import './plugins'

window.swal = (title,message,type)=>{
    Swal.fire({
        title: title,
        text: message,
        type: type,
        // confirmButtonText: 'Cool'
    })
}
window.formatNumber = formatNumber

window.App = {
    appId : process.env.MIX_APP_ID,
    baseUrl : process.env.MIX_APP_BASE_URL,
    protocol : process.env.MIX_APP_PROTOCOL,
    nodeEnv : process.env.MIX_NODE_ENV,
    currentUrl : '/',
    currentHash: ''
}

const guestRoutes = ['auth/login']

const needLogin = (route) => {
    if (guestRoutes.indexOf(route) < 0) {
        return isLogin() ? false : true
    } else {
        return false
    }
}

const isLogin = () => {
    return getCookie('token') ? true : false
    // return true
}

const initApp = () => {
    /* register all components */
    routes.forEach((item) => {
        // debugLog('routes', item)
        register(_.kebabCase(item.hash), module(item.component))
    })

    layoutComponents.forEach((item) => {
        // debugLog('layout', item)
        register(_.kebabCase(item), layout(item))
    })

    tagComponents.forEach((item) => {
        // debugLog('components', item)
        register(_.kebabCase(item), tagModule(item))
    })

}

const router = (e) => {

    App.currentUrl = location.href
    let request = parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    // let getUrl = (request.resource ? '/' + request.resource : '/') + (request.id ? '/' + ':id' : '') + (request.verb ? '/' + request.verb : '')
    let getUrl = (request.resource ? '/' + request.resource : '/') + (request.verb ? '/' + request.verb : '') + (request.id ? '/:id' : '')
    let parsedURL = getUrl.slice(1) === '' ? 'dashboard' : getUrl.slice(1)
    /* logout */
    if(parsedURL === 'logout') {
        localStorage.clear()
        goTo('auth/login')
    }

    let routeHash = routes.findIndex( item => {
        return item.hash === parsedURL
    })

    if (!isLogin()) goTo('auth/login')

    let authPage = needLogin(parsedURL)
    const objRoute = routes[routeHash] || {menu: true}
    const pUrl = _.kebabCase(parsedURL)
    // debugLog({parsedURL, routeHash, pUrl, authPage, objRoute})
    if(routeHash >= 0) {
        if(!authPage) {
            appComponent.setModuleActive(pUrl, objRoute.menu)
        }else {
            goTo('logout')
        }
    } else {
        if (parsedURL === 'login') {
            appComponent.setModuleActive(pUrl, false)
        } else {
            appComponent.setModuleActive(pUrl, true)
        }
    }

}

initApp()
const appComponent = component(MainLayout)(document.getElementById('page'))
window.cekData = appComponent
window.addEventListener('hashchange', router)
window.addEventListener('load', router)

$(document).ready(function () {
    const env = process.env.MIX_NODE_ENV
    document.title = 'Dashboard ' + (env === 'development' ? 'v' + app_version : '')
})