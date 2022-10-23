import {
    cancelAllRequest,
} from 'services/SDK/main'
import { settlementToolsInquiryUpdate } from 'appModule/billpayment/billpayment.sdk'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'
export default {
    onBeforeMount(props){
        this.modal = {}
        this.modal.id = randomString(10, {onlyChars: true})
        this.forms = {}
        this.forms.ttcId = randomString(8, {onlyChars: true})
        this.forms.remarksId = randomString(10, {onlyChars: true})
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.init(props.show)
    },
    onBeforeUpdate(props) {
        if (props.item) {
            this.forms.ttcValue = props.item.ttc
            this.forms.remarksValue = props.item.remarks
        }
    },
    onUpdated(props){
        this.init(props.show)
    },
    init(show) {
        const sel = $('#modal-' + this.modal.id)
        if (show) sel.modal('show')
        else sel.modal('hide')
    },
    submitForm() {
        // try call settlementToolsInquiryUpdate
        const ttcValue = this.$('#' + this.table.ttcId).value,
              remarksValue = this.$('#' + this.table.remarksId).value
        const data = {
            id: this.props.item.referenceNumber,
            ttc: ttcValue,
            remarks: remarksValue
        }
        debugLog(data)
    },
}