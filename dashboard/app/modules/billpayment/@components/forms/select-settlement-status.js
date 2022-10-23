import {
    cancelAllRequest,
} from 'services/SDK/main'
// import {
//     getProductCodes,
// } from 'appModule/billpayment/billpayment.sdk'
import { result } from 'lodash'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'
export default {
    onBeforeMount(props) {
        this.config = {}
        this.config.loading = true
        this.config.statuses = props.statuses || []
        if (typeof props.callback !== 'function') showAlertError(new Error('[Select Product Codes] Callback Is Required'))
    },
    onBeforeUnmount(props) {
        cancelAllRequest()
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (props.statuses) {
            this.config.statuses = props.statuses || []
        } else {
            this.config.statuses = this.getSettlementStatuses()
        }
        this.update()
    },
    onBeforeUpdate(props) {},
    onUpdated(props) {},
    getSettlementStatuses() {
        // try {
        //     debugLog('get billers manual if not set in first')
        //     const productCodes = await this.getCodes()
        //     this.config.codes = productCodes.map(x => ({name: x.prodCode, title: x.prodCategory, description: x.categoryDesc}))
        //     this.config.loading = false
        //     this.update()
        // } catch (err) {
        //     showAlertError(err)
        // }
        return [
            {
                name: 'ACTIVE',
                title: 'Active'
            },
            {
                name: 'INACTIVE',
                title: 'In Active'
            }
        ]
    },
    callback(res) {
        const cb = this.props.callback
        cb(res.data || {})
    },
}