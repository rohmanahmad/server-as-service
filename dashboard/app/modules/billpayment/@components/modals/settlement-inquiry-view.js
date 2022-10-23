import { showAlertError, randomString, debugLog } from 'helpers/utilities'
import { result } from 'lodash'

const fieldmap = {
    billerProviderName: "Provider Name",
    counterPartyName: "Partner Name",
    fullCounterPartyName: "Partner Fullname",
    aggregatorFee: 'Aggregator Fee',
    partnerBankAccountNumber: "Bank Account Number",
    partnerBankDestinationCode: "Bank Destination Code",
    partnerBankDestinationName: "Bank Destination Name",
    productCategory: "Product Category",
    productCode: "Product Code",
    productCodeFcubs: "FCUBS",
    ptbcEscrowAccountNumber: "PTBC Escrow Account Number",
    ptbcFee: 'PTBC Fee',
    referenceNumber: "Reference Number",
    remarks: "Remarks",
    settlementAmount: "Settlement Amount",
    settlementDate: 'Settlement Date',
    settlementPaymentMethod: "Payment Method",
    status: "Status",
    totalTransaction: "Total Transactions",
    ttc: "TTC",
    createdBy: "Created By",
    createdOnFormatted: "Created On",
    fileIdentifier: "File Identifier",
}

export default {
    init() {
        this.ids = {}
        this.ids.modal = randomString(10, {onlyChars: true})
        this.ids.settlementAmount = randomString(8, {onlyChars: true})
        this.ids.remarks = randomString(10, {onlyChars: true})
        this.callbackData = {
            settlementAmount: '',
            remarks: '',
        }
        this.parentItem = {
            child1: [],
            child2: [],
        }
    },
    onBeforeMount(props){
        this.init()
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (typeof props.callback !== 'function') showAlertError(new Error('[Settlement Inquiry Edit] Callback Is Required'))
    },
    onBeforeUpdate(props) {
        if (props.showModal) {
            this.parentItem = this.getItems()
            this.showModal()
        }
    },
    getItems() {
        let parentItem = {
            child1: [],
            child2: [],
        }
        const fieldCount = Object.keys(fieldmap).length
        const halfFieldCount = Math.ceil(fieldCount/2)
        const propsItem = this.props.item
        let n = 1
        for (const field in propsItem) {
            const label = result(fieldmap, field)
            const value = result(propsItem, field)
            if (label) {
                const item = {label, value}
                if (n > halfFieldCount) parentItem.child2.push(item)
                else parentItem.child1.push(item)
            }
            n += 1
        }
        return parentItem
    },
    onBeforeUnmount(props){
        this.callbackData = {}
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
        // this.modalEnabled = false
        this.callback()
    },
    callback() {
        this.props.callback()
    }
}