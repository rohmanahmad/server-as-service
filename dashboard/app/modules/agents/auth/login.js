import { setParamApp, goTo } from 'helpers/ma'
const pjson = require('packagejson')
import { encrypt } from 'helpers/security'
import { setCookie } from 'helpers/cookie'
import 'libs/validator.lib.js'
import { showAlertError } from 'helpers/utilities'
import {
    cancelAllRequest
} from 'services/SDK/main'
import {
    LoginAgent,
    getListDomainExternals,
} from 'appModule/agents/agents.sdk'
const component = [
    "customer.menu",
    "mypendingtask.menu",
    "useraccess.menu",
]
export default {
    state: {
        isDev: process.env.MIX_NODE_ENV === 'development'
    },
    onBeforeMount() {
        this.invalidDomains = []
        this.runTest('commbank-api', process.env.MIX_PROXY_URL_BASE)
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted(props) {
        this.version_app = pjson.app_version;
        setParamApp({ currentComponent: 'login' })
        new Validator(document.querySelector('#login-form'), this.doLogin)
        this.update()
        getListDomainExternals()
            .then(body => {
                this.testDomains(body)
            })
    },
    doLogin(err, res) {
        if(res) {
            const userid = this.$('input[name=username]').value
            encrypt(this.$('input[name=password]').value)
                .then((password) => {
                    LoginAgent({userid, password})
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
        }
    },
    async testDomains(domains={}) {
        for (const name in domains) {
            const domain = domains[name]
            this.invalidDomains.push(domain)
            // await this.runTest(name, domain)
        }
        this.update()
    },
    async runTest (name, domain) {
        try {
            await fetch(domain, {
                method: 'GET'
            })
        } catch (err) {
            // this.invalidDomains.push(domain)
            console.log(err)
        }
    },
    permitDomains() {
        for (const domain of this.invalidDomains) {
            window.open(domain)
        }
    }
}