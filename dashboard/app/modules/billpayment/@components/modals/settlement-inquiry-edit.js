import {
    cancelAllRequest,
} from 'services/SDK/main'
import { settlementToolsInquiryUpdate } from 'appModule/billpayment/billpayment.sdk'
import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'
import { result } from 'lodash'

export default {
    onBeforeMount(props){
        this.ids = {}
        this.ids.modal = randomString(10, {onlyChars: true})
        this.ids.settlementAmount = randomString(8, {onlyChars: true})
        this.ids.remarks = randomString(10, {onlyChars: true})
        this.isprocessing = false
        this.callbackData = {}
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (typeof props.callback !== 'function') showAlertError(new Error('[Settlement Inquiry Edit] Callback Is Required'))
    },
    onBeforeUpdate(props) {
        console.log(props.showModal, this.modalEnabled, props.showModal)
        if (props.showModal && this.modalEnabled !== props.showModal) {
            this.showModal()
            if (props.item) {
                this.callbackData.settlementAmount = result(props.item, 'settlementAmount', '').replace(/\,/g, '')
                this.callbackData.remarks = result(props.item, 'remarks', '')
            }
        }
    },
    onUpdated(props){
    },
    onBeforeUnmount(props){
        //this.callbackData = {}
        cancelAllRequest()
    },
    showModal() {
        const el = $('#' + this.ids.modal)
        if (el) {
            this.modalEnabled = true
            el.modal('show')
            el.on('hidden.bs.modal', () => {
                this.hideModal()
            })
        }
    },
    hideModal() {
        const el = $('#' + this.ids.modal)
        if (el) {
            el.modal('hide')
        }
        this.modalEnabled = false
        this.callback()
    },
    callback() {
        this.props.callback(this.callbackData)
    },
    submitForm() {
        // try call settlementToolsInquiryUpdate
        this.isprocessing = true
        this.update()
        const settlementAmountValue = this.$('#' + this.ids.settlementAmount).value,
              remarksValue = this.$('#' + this.ids.remarks).value
        const data = {
            reference: this.props.item.referenceNumber,
            settlementAmount: settlementAmountValue,
            remarks: remarksValue
        }
        settlementToolsInquiryUpdate(data)
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.isprocessing = false
                this.update()
                if (!res) return false
                showAlertSuccess('Saved')
                this.callbackData.refresh = true
                this.hideModal()
            })
    },
}