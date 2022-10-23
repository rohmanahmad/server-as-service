import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    listBanks,
} from 'appModule/billpayment/billpayment.config'
import { result } from 'lodash'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'
export default {
    onBeforeMount(props) {
        this.config = {}
        this.config.loading = true
        this.config.list = listBanks.map(x => ({name: x, title: x}))
        if (typeof props.callback !== 'function') showAlertError(new Error('[Droprown Bank List] Callback Is Required'))
        this.dropdownId = randomString(10, {onlyChars: true})
    },
    onBeforeUnmount(props) {
        cancelAllRequest()
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUpdate(props) {},
    onUpdated(props) {},
    callback(res) {
        const cb = this.props.callback
        cb(res.data || {})
    },
}