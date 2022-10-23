import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    getProductCodes,
} from 'appModule/billpayment/billpayment.sdk'
import { result } from 'lodash'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'
import { productCodes } from 'appModule/billpayment/billpayment.config'
export default {
    onBeforeMount(props) {
        this.config = {}
        this.config.loading = true
        this.config.codes = props.codes || []
        if (typeof props.callback !== 'function') showAlertError(new Error('[Select Product Codes] Callback Is Required'))
    },
    onBeforeUnmount(props) {
        cancelAllRequest()
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.config.codes = productCodes
        this.update()
    },
    onBeforeUpdate(props) {},
    onUpdated(props) {},
    updateSelectedCode(res) {
        const cb = this.props.callback
        cb(res.data || {})
    },
}