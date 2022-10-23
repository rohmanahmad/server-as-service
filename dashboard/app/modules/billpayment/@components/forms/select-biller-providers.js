import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    getBillerProviders,
} from 'appModule/billpayment/billpayment.sdk'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'
import { result } from 'lodash'
const billerAllOption = {
    name: 'ALL',
    title: 'ALL',
    codeWay4: ''
}
export default {
    onBeforeMount(props) {
        if (typeof props.callback !== 'function') showAlertError(new Error('[Select Biller Provider] Callback Is Required'))
        this.dropdownId = randomString(10, {onlyChars: true})
        this.config = {}
        this.config.loading = true
        this.config.billers = props.billers || []
    },
    onBeforeUnmount(props) {
        cancelAllRequest()
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (props.billers) {
            this.config.billers = props.billers || []
            if (props.acceptAllValue) this.config.billers = [billerAllOption, ...this.config.billers]
            this.update()
        } else {
            this.getBillers()
                .then(res => {
                    this.getMapBillers()
                        .then(billers => {
                            this.config.billers = billers
                            this.update()
                        })
                })
        }
    },
    onBeforeUpdate(props) {
    },
    onUpdated(props) {
        if (this.currentPartnerGroup!== props.partnerGroup) {
            this.getMapBillers()
                .then(billers => {
                    this.config.billers = billers
                    this.update()
                })
        }
    },
    async getBillers() {
        try {
            debugLog('get billers manual if not set in first')
            const billerList = await this.requestBillerProviders() // produce this.billerList
            let billers = billerList
                .map(x => ({
                    name: x.billerName,
                    title: x.billerName,
                    partnerName: x.partnerName,
                    codeWay4: x.productCodeWay4
                }))
            this.config.loading = false
            if (this.props.acceptAllValue) billers = [billerAllOption, ...billers]
            this.billers = billers
            return billers
        } catch (err) {
            showAlertError(err)
        }
    },
    async getMapBillers() {
        let list = []
        if (!this.billers) list = await this.getBillers()
        if (this.props.partnerGroup) {
            list = this.billers.filter(x => x.partnerName === this.props.partnerGroup.toUpperCase())
        } else {
            list = this.billers
        }
        this.currentPartnerGroup = this.props.partnerGroup
        return list
    },
    async requestBillerProviders() {
        if (this.billerList) return 
        const req = await getBillerProviders({})
        const list = result(req, 'data', [])
        return list
    },
    updateSelectedBiller(res) {
        const cb = this.props.callback
        if (!this.props.dropdown) cb(res)
        else cb(res.data)
    },
}