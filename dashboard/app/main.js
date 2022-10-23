import { app_version } from '../package.json'
import { component, register } from 'riot'
import appModule from 'appModule'
import layoutModule, { layoutComponents } from 'layoutModule'
import tagModule, { tagComponents } from 'components'
import MainLayout from './layouts/main-layout.riot'
import routes from './services/routes'
import { formatNumber, parseRequestURL, logInfo, logError } from './helpers/utilities.js'
import { eraseCookie, getCookie } from 'helpers/cookie'
import { goTo } from 'helpers/ma'
// import { debugLog } from 'helpers/utilities'
import _ from 'lodash'
import Swal from 'sweetalert2/dist/sweetalert2.js'
/* plugins app */
import 'services/app-plugins.js'

import { LogoutAgent } from 'appModule/agents/agents.sdk'

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

const guestRoutes = ['register', 'login']

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
        register(_.kebabCase(item.hash), appModule(item.component))
    })

    layoutComponents.forEach((item) => {
        // debugLog('layout', item)
        register(_.kebabCase(item), layoutModule(item))
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
        LogoutAgent()
            .then((res)=>{
                eraseCookie('name')
                eraseCookie('userid')
                eraseCookie('token')
                eraseCookie('refresh')
                // localStorage.removeItem("access")
                // localStorage.removeItem("token")
                localStorage.clear()
            })
            .catch((err)=>{
                logError(err)
            })
            goTo('login')
    }

    let routeHash = routes.findIndex( item => {
        return item.hash === parsedURL
    })

    if (!isLogin()) goTo('login')

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

var idleTime = 0
$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(() => {
        timerIncrement()
        // deleteInterval(idleInterval)
    }, 5 * 1000) // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0
    })
  
    $(this).keypress(function (e) {
        idleTime = 0
    })

    const env = process.env.MIX_NODE_ENV
    document.title = 'Commbank CRM ' + (env === 'development' ? 'v' + app_version : '')
})

function timerIncrement() {
    if ((window.location.href || '').indexOf('#/login') < 0) {
        idleTime = idleTime + 5
        const timeout = parseInt(process.env.MIX_IDLE_TIMEOUT) || 600
        if (idleTime > timeout) { // 20 minutes
            goTo('logout')
        }
    }
}