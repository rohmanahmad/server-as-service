import {
    cancelAllRequest,
    // settlementGenerateMonthlyReport
} from 'services/SDK/main'
import {
    masterdbCreateNew,
    masterdbUpdate,
} from 'appModule/billpayment/billpayment.sdk'
import { patternMethod } from 'appModule/billpayment/billpayment.config'
import { customValidation } from 'helpers/validation'
import { result } from 'lodash'
import { partners } from 'appModule/billpayment/billpayment.config'
const partnerObj = partners.reduce((r, x) => {
    const k = x.name
    r[k] = x.title
    return r
}, {})
// utilities
import { randomString, showAlertError, showAlertSuccess, debugLog } from 'helpers/utilities'

const createValidationRules = {
    partnerName: {required: true},
    billerProviderName: {required: true},
    productCategory: {required: true},
    fullPartnerName: {required: true},
    productCode: {required: true},
    partnerBankDestinationName: {required: true},
    partnerBankAccountNumber: {required: true},
    partnerBankDestinationCode: {required: true},
    ptbcEscrowAccountNumber: {required: true},
    productCodeFcubs: {required: true},
    productCodeWay4: {required: true},
    settlementPaymentMethod: {required: true},
    ttc: {required: true},
    settlementAmount: {required: true},
    // remarks: "required", // optional
}

export default {
    init() {
        this.ids = {
            modal: randomString(10, {onlyChars: true}),
            ptbc_cust_acc_no: randomString(10, {onlyChars: true}),
            counterparty_bank_code: randomString(10, {onlyChars: true}),
            // counterparty_bank_name: randomString(10, {onlyChars: true}),
            counterparty_acc_no: randomString(10, {onlyChars: true}),
            // counterparty_receiver_name: randomString(10, {onlyChars: true}),
            product_code_fcubs: randomString(10, {onlyChars: true}),
            ttc: randomString(10, {onlyChars: true}),
            remarks: randomString(10, {onlyChars: true}),
        }
        this.customPattern = {}
        this.customPattern.settlementAmount = null
        this.customPattern.paymentMethod = null
    },
    reset() {
        this.isgenerating = false
        this.payload = {
            partnerName: null,
            fullPartnerName: null,
            billerProviderName: null, // dropdown "Biller Provider Name"
            productCodeWay4: null, // dropdown "Biller Provider Name"
            productCodeFcubs: null,
            ptbcEscrowAccountNumber: null, // input text "PTBC Customer Acc. No(escrow) "
            partnerBankDestinationName: null,
            partnerBankDestinationCode: null,
            partnerBankAccountNumber: null,
            settlementAmount: null,
            settlementPaymentMethod: null, // dropdown "Payment Method"
            productCategory: null, // dropdown "Product Category"
            productCode: null, // dropdown "Product Category"
            ttc: null,
            remarks: null,
        }
        this.callbackData = {}
        this.isSubmitting = false
    },
    onBeforeMount(props) {
        // debugLog('[ADD_NEW_MASTERDB_MODAL] [BEFORE_MOUNT]')
        this.init()
        this.reset()
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUnmount(){
        cancelAllRequest()
    },
    onUpdated(props) {
        if (props.showModal && this.modalEnabled !== props.showModal) {
            this.reset()
            this.showModal()
            if (Object.keys(props.data).length > 0) {
                const partnerName = result(props.data, 'partnerName', null)
                this.payload.partnerCode = props.data.partnerCode
                this.payload.partnerName = partnerName
                this.payload.fullPartnerName = partnerObj[partnerName]
                this.payload.billerProviderName = result(props.data, 'billerProviderName', null)
                this.payload.ptbcEscrowAccountNumber = result(props.data, 'ptbcEscrowAccountNumber', null)
                this.payload.partnerBankDestinationName = result(props.data, 'partnerBankDestinationName', null)
                this.payload.partnerBankDestinationCode = result(props.data, 'partnerBankDestinationCode', null)
                this.payload.partnerBankAccountNumber = result(props.data, 'partnerBankAccountNumber', null)
                this.payload.settlementAmount = result(props.data, 'settlementAmount', null)
                this.payload.settlementPaymentMethod = result(props.data, 'settlementPaymentMethod', null)
                this.payload.productCategory = result(props.data, 'productCategory', null)
                this.payload.productCode = result(props.data, 'productCodeFcubs', null)
                this.payload.productCodeWay4 = result(props.data, 'productCodeWay4', null)
                this.payload.productCodeFcubs = result(props.data, 'productCodeFcubs', null)
                this.payload.ttc = result(props.data, 'ttc', null)
                this.payload.remarks = result(props.data, 'remarks', null)
                this.editMode = true
                this.update()
            }
        }
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
        this.resetForm()
        this.reset()
    },
    onBeforeUnmount(props) {},
    resetForm() {
        this.payload = {}
        for (const id in this.ids) {
            const inputId = '#' + this.ids[id]
            const el = this.$(inputId)
            if (el && el.value) {
                el.value = ''
            }
        }
    },
    // callbacks
    callback() {
        this.props.callback(this.callbackData)
    },
    callbackBillerProviderName(res) {
        this.payload.productCodeWay4 = res.codeWay4
        this.payload.billerProviderName = res.name
    },
    callbackProductCode(res) {
        this.payload.productCategory = res.name
        this.payload.productCode = res.fcubs
        this.update()
    },
    callbackPaymentMethod(res) {
        // if (res.code === this.payload.ttc) return
        this.payload.ttc = res.code
        this.payload.settlementPaymentMethod = res.name
        this.update()
    },
    callbackDeactivate(res) {
        this.payload.deactivateFlag = res.value === 'yes'
    },
    doCreate(btnCbData={}) {
        try {
            this.isgenerating = true
            this.update()
            const inputsIds = {
                'ptbc_cust_acc_no': 'ptbcEscrowAccountNumber',
                'counterparty_acc_no': 'partnerBankAccountNumber',
                'product_code_fcubs': 'productCodeFcubs',
                'counterparty_bank_code': 'partnerBankDestinationCode',
                // 'counterparty_bank_name': 'partnerBankDestinationName',
                'product_code_fcubs': 'productCodeFcubs',
                'ttc': 'ttc',
                'remarks': 'remarks',
            }
            for (const i in inputsIds) {
                const k = inputsIds[i]
                const inputId = this.ids[i]
                const el = this.$('#' + inputId)
                if (el) this.payload[k] = el.value
            }
            customValidation(this.payload, createValidationRules)
            masterdbCreateNew(this.payload)
            .catch(err => {
                    showAlertError(err)
                    return null
                })
                .then(res => {
                    if (!res) return false
                    showAlertSuccess()
                    this.isgenerating = false
                    this.update()
                    this.callbackData.refresh = true
                    this.hideModal()
                })
        } catch (err) {
            this.isgenerating = false
            this.update()
            showAlertError(err)
        }
    },
    doSubmit(e) {
        if (e && e.preventDefault) e.preventDefault()
        this.isSubmitting = true
        this.update()
        const savePayload = {
            partnerCode: result(this.payload, 'partnerCode'),
            newRow:{
                partnerCode: result(this.props.data, 'partnerCode'), // tidak boleh di update
                partnerName: result(this.payload, 'partnerName'), // tidak boleh di update
                billerProviderName: result(this.payload, 'billerProviderName'), // tidak boleh di update
                productCodeWay4: result(this.payload, 'productCodeWay4'),
                productCodeFcubs: result(this.payload, 'productCodeFcubs'),
                partnerBankDestinationName: result(this.payload, 'partnerBankDestinationName'),
                partnerBankAccountNumber: result(this.payload, 'partnerBankAccountNumber'),
                settlementAmount: result(this.payload, 'settlementAmount'),
                settlementPaymentMethod: result(this.payload, 'settlementPaymentMethod'),
                productCategory: result(this.payload, 'productCategory'),
                ttc: result(this.payload, 'ttc'),
                ptbcEscrowAccountNumber: result(this.payload, 'ptbcEscrowAccountNumber'),
                createdBy: result(this.props.data, 'createdBy'),
                createdOn: result(this.props.data, 'createdOn'),
                remarks: result(this.payload, 'remarks'),
            },
            remarks: result(this.payload, 'remarks'),
            submittedBy: "SETUP_IN_BACKEND",
            deactivateFlag: result(this.payload, 'deactivateFlag', false)
        }
        const inputsIds = {
            'ptbc_cust_acc_no': 'ptbcEscrowAccountNumber',
            'counterparty_acc_no': 'partnerBankAccountNumber',
            'product_code_fcubs': 'productCodeFcubs',
            'counterparty_bank_code': 'partnerBankDestinationCode',
            'counterparty_bank_name': 'partnerBankDestinationName',
            'product_code_fcubs': 'productCodeFcubs',
            'ttc': 'ttc',
            'remarks': 'remarks',
        }
        for (const i in inputsIds) {
            const k = inputsIds[i]
            const inputId = this.ids[i]
            const el = this.$('#' + inputId)
            if (el) {
                savePayload.newRow[k] = el.value
                if (k === 'remarks') savePayload[k] = el.value
            }
        }
        masterdbUpdate(savePayload)
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.isSubmitting = false
                this.update()
                if (!res) return false
                showAlertSuccess('Saved')
                this.callbackData.refresh = true
                this.hideModal()
            })
    },
    callbackSettlementAmount(data) {
        this.payload['settlementAmount'] = data.name
        const v = data.name
        if (this.patternKey && ['artajasa_bni', 'artajasa_mandiri', 'mitracomm_bca'].indexOf(this.patternKey) > -1) {
            if (v === 'LESS_THAN_BIO') {
                this.customPattern.paymentMethod = ['SKN']
                this.payload.settlementPaymentMethod = "SKN"
            } else if (v === 'GREATER_THAN_BIO') {
                this.customPattern.paymentMethod = ['RTGS']
                this.payload.settlementPaymentMethod = "RTGS"
            }
            this.update()
        }
    },
    callbackPartners(res) {
        if (res.name === this.payload.partnerName) return
        this.payload['partnerName'] = res.name
        this.payload['fullPartnerName'] = res.title
        this.update()
    },
    callbackCounterpartyBankName(res){
        // let dataValue = this.$('#' + this.ids.counterparty_bank_name).value
        const dataValue = res.name
        this.patternKey = null
        const patternKey = [this.payload.partnerName, dataValue.replace(/bank /i, '')].join('_').replace(/ /g, '_').toLowerCase()
        if (patternKey && patternMethod[patternKey]) {
            const newPattern = patternMethod[patternKey]
            this.customPattern.settlementAmount = newPattern.settlementAmountTypes
            this.customPattern.paymentMethod = newPattern.paymentMethods
            if (patternKey === 'artajasa_bi_rtgs') {
                this.payload.settlementPaymentMethod = "RTGS"
                this.payload.settlementAmount = "NO_LIMIT"
            }
            this.patternKey = patternKey
        } else {
            this.customPattern.settlementAmount = null
            this.customPattern.paymentMethod = null
        }
        this.payload.partnerBankDestinationName = res.name
        this.update()
    },
}