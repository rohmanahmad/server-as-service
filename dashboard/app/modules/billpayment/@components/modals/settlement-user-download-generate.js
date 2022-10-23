import {
    cancelAllRequest,
} from 'services/SDK/main'
// utilities
import { showAlertError, randomString, debugLog } from 'helpers/utilities'

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
            provider_name: '',
            from_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD')
        }
    },
    onMounted() {
        this.registerListener()
    },
    onUpdated() {
        this.isprocessing = false
        const isShow = this.props.show
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
    setDate({ since, type, name }) {
        debugLog(type, name, since)
        this.formItems[type] = since.format('YYYY-MM-DD') // save result into this.formItems variable
    },
    cbProvider(data) {
        this.formItems['provider_name'] = data.value
    },
    submitForm() {
        try {
            this.isprocessing = true
            this.update()
            // validation form
            debugLog(this.formItems)
            // settlementGenerateMonthlyReport(this.formItems, {})
            //     .catch((err) => {
            //         showAlertError(err)
            //         return null
            //     })
            //     .then((res) => {
            //         // do here
            //     })
        } catch (err) {
            showAlertError(err)
        }
    },
}