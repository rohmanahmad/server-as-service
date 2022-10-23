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
                name: 'NEW',
                title: 'New'
            },
            {
                name: 'SUBMITTED_BY_MAKER',
                title: 'Submitted by Maker'
            },
            {
                name: 'REJECTED_FROM_CHECKER',
                title: 'Rejected From Checker'
            },
            {
                name: 'APPROVED',
                title: 'Approved'
            },
            {
                name: 'SUCCEED',
                title: 'Succeed'
            },
            {
                name: 'FAILED',
                title: 'Failed'
            }
        ]
    },
    callback(res) {
        const cb = this.props.callback
        cb(res.data || {})
    },
}