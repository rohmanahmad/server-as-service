import {
    cancelAllRequest,
} from 'services/SDK/main'
// utilities
import { showAlertError, debugLog } from 'helpers/utilities'

const modalId = '#modal-settlement-monthly-report'

export default {
    isprocessing: false,
    providerList: [
        {
            name: 'indosat',
            title: 'Indosat'
        },
        {
            name: 'artajasa',
            title: 'Artajasa'
        }
    ],
    dateOptions: {
        singleDatePicker: true,
    },
    isShow: false,
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onBeforeMount(){
        this.form = {
            provider_name: '',
            from_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD')
        }
    },
    onMounted() {
        this.registerListener()
    },
    onUpdated() {
        const isShow = this.props.show
        this.isShow = isShow
        if (isShow) {
            this.showModal()
        }
    },
    registerListener() {
        $(modalId).on('hide.bs.modal', () => {
            this.isShow = false
        })
    },
    showModal() {
        $(modalId).modal('show')
        this.isShow = true
    },
    hideModal() {
        $(modalId).modal('hide')
        this.isShow = false
    },
    setDate(type, result) {
        debugLog('[setdate]', {type, result})
        this.form[type] = result.format('YYYY-MM-DD') // save result into this.form variable
    },
    submitForm() {
        try {
            this.isprocessing = true
            this.update()
            this.form.provider_name = this.$('#provider-name').value
            // validation form
            for (const fieldName in this.form) {
                if (!this.form[fieldName]) throw new Error(`${fieldName} Required`)
            }
            settlementGenerateMonthlyReport(this.form, {})
                .catch((err) => {
                    showAlertError(err)
                    return null
                })
                .then((res) => {
                    // do here
                })
        } catch (err) {
            showAlertError(err)
        }
    }
}