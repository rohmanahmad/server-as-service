import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'
import { partners } from 'appModule/billpayment/billpayment.config'
export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Partners Dropdown] Callback Required'))
        this.dropdownId = randomString(10, {onlyChars: true})
        this.partners = partners
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    // callback
    callback(res) {
        this.props.callback(res.data)
    }
}