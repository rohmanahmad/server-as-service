import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'
import { settlementAmountTypes } from 'appModule/billpayment/billpayment.config'
export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Settlement Amount Dropdown] Callback Required'))
        this.dropdownId = randomString(10, {onlyChars: true})
        // this.settlementAmounts = settlementAmountTypes
    },
    onBeforeUpdate() {
        if (this.props.availableAmounts) {
            this.settlementAmounts = settlementAmountTypes.filter(x => this.props.availableAmounts.indexOf(x.name) > -1 )
        } else {
            this.settlementAmounts = settlementAmountTypes
        }
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    // callback
    callback(res) {
        this.props.callback(res.data)
    }
}