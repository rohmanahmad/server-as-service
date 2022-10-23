import {
    cancelAllRequest,
} from 'services/SDK/main'
// utilities
import { generateSettlementReportValidation } from 'appModule/billpayment/billpayment.sdk'
import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount(props){
        this.isprocessing = false
        this.modalId = 'modal-' + randomString(10, { onlyChars: true })
        this.formItems = {}
        this.callback = props.callback
        this.dateOptions = {
            singleDatePicker: true,
        }
        this.formItems = {
            date: moment().toISOString(),//format('YYYY-MM-DD'),
            billers: 'ALL'
        }
    },
    onMounted() {
        this.registerListener()
    },
    onUpdated() {
        this.isprocessing = false
        const isShow = this.props.showModal
        if (isShow) {
            this.showModal()
        }
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    registerListener() {
        $('#' + this.modalId).on('hide.bs.modal', () => {
            this.callback({show: false})
        })
    },
    showModal() {
        $('#' + this.modalId).modal('show')
    },
    hideModal() {
        $('#' + this.modalId).modal('hide')
        this.callback({show: false})
    },
    setDate(type, res) {
        this.formItems[type] = res.since.toISOString()//format('YYYY-MM-DD') // @deprecated, see update on date-range-picker-single save result into this.formItems variable
    },
    callback() {
        this.props.callback()
    },
    submitForm() {
        try {
            this.isprocessing = true
            this.update()
            // validation form
            generateSettlementReportValidation(this.formItems)
                .catch((err) => {
                    showAlertError(err)
                    return null
                })
                .then((res) => {
                    showAlertSuccess()
                    this.hideModal()
                })
        } catch (err) {
            showAlertError(err)
        }
    },
    // updateBillerPayload(billers) {
    //     this.formItems['billers'] = billers.join()
    // }
}