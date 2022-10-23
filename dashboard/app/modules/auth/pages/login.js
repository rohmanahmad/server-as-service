import { setParamApp, goTo } from 'apphelpers/ma'
const pjson = require('package')
import { encrypt } from 'apphelpers/security'
import { setCookie } from 'apphelpers/cookie'
import { showAlertError } from 'apphelpers/utilities'
import {
    cancelAllRequest
} from 'appsdk'
import {
    Login,
} from '../config/auth.sdk'
const component = [
    "customer.menu",
    "mypendingtask.menu",
    "useraccess.menu",
]
export default {
    state: {
        isDev: process.env.MIX_NODE_ENV === 'development'
    },
    onBeforeMount() {},
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted(props) {
        this.version_app = pjson.app_version;
        setParamApp({ currentComponent: 'login' })
        this.update()
    },
    doLogin(e) {
        if (e && e.preventDefault) e.preventDefault()
        const userid = this.$('input[name=username]').value
        encrypt(this.$('input[name=password]').value)
            .then((password) => {
                Login({userid, password})
                    .then((response)=>{
                        try {
                            let data = response.data;
                            localStorage.setItem('token', data.auth.token)
                            let access = data.access
                            let dataMenu = _.filter(access, (val) => {
                                            return component.indexOf(val) > -1
                                        })
                            setCookie('token',data.auth.token)
                            setCookie('userid',data.userid)
                            setCookie('name',data.name)
                            localStorage.setItem('lastLogin', data.lastLogin)
                            localStorage.setItem('access', JSON.stringify(access))
                            let urlMenu = ''
                            dataMenu = (_.orderBy(dataMenu,[0],['asc']))
                            switch (dataMenu[0]) {
                                case 'customer.menu':
                                    urlMenu = 'com_mob/customers'
                                    break;
                                case 'mypendingtask.menu':
                                    urlMenu = 'task/pendings'
                                    break;
                                case 'useraccess.menu':
                                    urlMenu = 'user/access'
                                    break;
                            }
                            // console.log('urlMenu',urlMenu)
                            goTo(urlMenu)
                            // window.location.reload()
                        }catch(err){
                            console.log(err)
                            // throw Error()
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                        showAlertError(err)
                    })
            })
    },
}