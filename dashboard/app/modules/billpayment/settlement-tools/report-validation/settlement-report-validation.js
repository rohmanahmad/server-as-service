import {
    cancelAllRequest,
} from 'services/SDK/main'
import { result } from 'lodash'
import {
    reportValidationList,
    reportValidationSendCommand,
    // settlementToolsInquiryDownloadTrx,
    reportValidationDownloadFileAggregator,
    reportValidationDownloadTransactionDetails
} from 'appModule/billpayment/billpayment.sdk'
// import { reportValidationList } from 'appModule/billpayment/billpayment.sdk.dummy'
import { showAlertError, showAlertSuccess, randomString, formatNumber, debugLog } from 'helpers/utilities'
import { settlementReportValidationStatuses } from 'appModule/billpayment/billpayment.config'
import downloadFile from 'js-file-download'

export default {
    onBeforeMount() {
        this.dataInformation = {
            availableLimits: [10, 20, 50, 100],
            availablePages: 3,
            currentPage: 1,
        }
        this.pagination = {
            hasPrev: false,
            hasNext: 1,
        }
        this.loading = {
            reject: false,
            authorize: false,
            confirm: false,
        }
        this.access = {}
        this.options = {}
        this.buttonDisabled = true
        this.checkedItems = []
        this.disableToAuthorizeOrReject = false
        this.disableToConfirm = false
        this.onGenerating = false
        this.modalGenerate = {show: false}
        this.initFilterAndSearch()
        this.initTable()
        this.initModal()
    },
    updateModal() {
        this.modalGenerate.show = false
        this.update()
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted() {
        this.getData()
    },
    // initiate table
    initTable() {
        this.table = {}
        this.table.id = randomString(10, {onlyChars: true})
        this.table.items = []
        this.table.loadingdata = true
        this.access = {}
    },
    initFilterAndSearch() {
        this.search = {}
        this.search.start = moment().format('YYYY-MM-DD')
        this.search.end = moment().format('YYYY-MM-DD')
        // this.search.status = 'ALL' // status blm ready di mb. wulan
        this.search.billers = 'ALL'
    },
    initModal() {
        this.modal = {}
        this.modal.show = false
    },
    updateSearchPayload(field, res={}) {
        if (['start', 'end'].indexOf(field) > -1) this.search[field] = res.date.format('YYYY-MM-DD')
        else if (field === 'billers') {
            if (res.length === 0) res = ['ALL']
            this.search[field] = res.join()
        }
        else if (field === 'status') this.search[field] = res.name
        else this.search[field] = res.value
    },
    async getData () {
        this.table.loadingdata = true
        this.checkedItems = []
        this.checkedItemsDetail = []
        this.update()
        try {
            const q = Object.keys(this.search || {})
                .map(x => ({ key: x, value: this.search[x] }))
                .reduce((r, x) => {
                    if (x.value) r[x.key] = x.value
                    return r
                }, {})
            const res = await reportValidationList(q)
            const items = result(res, 'data.items', [])
            this.access = result(res, 'data.access', {})
            // debugger;
            this.options = result(res, 'data.options', {})
            this.table.isNoData = true
            if (items) {
                this.table.items = items.map((x, i) => {
                    x.n = parseInt(i) + 1
                    x.status = settlementReportValidationStatuses[x.status]
                    x.settlementAmount = formatNumber(x.settlementAmount)
                    x.actions = {}
                    const status = x.status.toLowerCase()
                    switch(status) {
                        case 'rejected from checker':
                            if (this.access.edit) x.actions.edit = true
                        break
                        case 'new':
                            if (this.access.edit) x.actions.edit = true
                        break
                    }
                    return x
                })
                if (items.length > 0) this.table.isNoData = false
            }
            this.update()
        } catch (err) {
            showAlertError(err)
        }
        this.table.loadingdata = false
        this.update()
    },
    showEditInquiry(item) {
        this.modal.editItem = item
        this.modal.show = true
        this.update()
    },
    searchData() {
        this.getData()
    },
    paginationCallback(res) {
        debugLog(res)
    },
    toggleCheck(e) {
        const el = $(e.target)
        const name = el.data('name')
        const status = el.data('status')
        const isChecked = el.is(':checked')
        if (isChecked) this.checkedItemsDetail.push({name, status})
        else this.checkedItemsDetail = this.checkedItemsDetail.filter(x => x.name !== name)
        
        this.checkedItems = this.checkedItemsDetail.map(x => x.name)
        const checkedStatuses = this.checkedItemsDetail.map(x => x.status.toUpperCase())
        this.disableToConfirm = (checkedStatuses.filter(x => ['NEW', 'REJECTED FROM CHECKER'].indexOf(x) === -1)).length > 0
        this.disableToAuthorizeOrReject = (checkedStatuses.filter(x => ['SUBMITTED BY MAKER'].indexOf(x) === -1)).length > 0
        if (this.checkedItems.length === 0) this.buttonDisabled = true
        else this.buttonDisabled = false
        // console.log({
        //     checked: this.checkedItems.length,
        //     disableToConfirm: this.disableToConfirm,
        //     disableToAuthorizeOrReject: this.disableToAuthorizeOrReject,
        // })
        this.update()
    },
    getCheckedItems() {
        return this.checkedItems
    },
    doView(e, item) {
        if (e && e.preventDefault) e.preventDefault()
        console.log('doView')
    },
    doReject(res) {
        if (this.disableToAuthorizeOrReject) return showAlertError(new Error('Reject Action Can Only Processed with "SUBMITTED BY MAKER" status'))
        const conf = confirm('Are You Sure To Reject??')
        if (!conf) return null
        this.loading['reject'] = true
        this.update()
        this.sendCommand(this.getCheckedItems(), 'REJECT')
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.getData()
                this.loading['reject'] = false
                this.update()
                if (!res) return false
                showAlertSuccess()
            })
    },
    doAuthorize(res) {
        if (this.disableToAuthorizeOrReject) return showAlertError(new Error('Authorize Action Can Only Processed with "SUBMITTED BY MAKER" status'))
        const conf = confirm('Are You Sure To Authorize??')
        if (!conf) return null
        this.loading['authorize'] = true
        this.update()
        this.sendCommand(this.getCheckedItems(), 'AUTHORIZE')
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.getData()
                this.loading['authorize'] = false
                this.update()
                if (!res) return false
                showAlertSuccess()
            })
    },
    doConfirm(res) {
        if (this.disableToConfirm) return showAlertError(new Error('Confirm Action Can Only Processed with "NEW or REJECTED FROM CHECKER" status'))
        const conf = confirm('Are You Sure To Confirm??')
        if (!conf) return null
        this.loading['confirm'] = true
        this.update()
        this.sendCommand(this.getCheckedItems(), 'CONFIRM')
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.getData()
                this.loading['confirm'] = false
                this.update()
                if (!res) return false
                showAlertSuccess()
            })
    },
    async sendCommand(referenceNumber, commandType) {
        try {
            if (!referenceNumber || (referenceNumber && referenceNumber.length === 0)) throw new Error('ReferenceId Required')
            referenceNumber = referenceNumber.join()
            await reportValidationSendCommand({ referenceNumber, commandType })
            showAlertSuccess()
        } catch (err) {
            showAlertError(err)
        }
    },
    downloadTransactionDetails(res) {
        const referenceNumbers = this.getCheckedItems().join()
        reportValidationDownloadTransactionDetails({filename: true}, {})
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(filename => {
                if (!filename) return false
                reportValidationDownloadTransactionDetails({ referenceNumbers })
                    .catch(err2 => {
                        showAlertError(err2)
                        return null
                    })
                    .then(data => {
                        downloadFile(data, filename)
                    })
            })
    },
    directDownloadTransactionDetails (res) {
        const referenceNumbers = this.getCheckedItems().join()
        const { billURL, billTrxDownloadPath } = this.options
        if (!billURL || !billTrxDownloadPath) return showAlertError(new Error('Invalid Download URL or Download Path'))
        const fullUrl = billURL + billTrxDownloadPath + '?referenceNumbers=' + referenceNumbers
        window.open(fullUrl)
    },
    updateSettlement(res) {
        this.modal.show = false
        this.update()
        if (res.refresh) this.getData()
    },
    showModalGenerateTransaction() {
        this.modalGenerate.show = true
        this.update()
    },
    downloadFileAggregator(e, item) {
        if (e && e.preventDefault) e.preventDefault()
        const identifier = item.fileIdentifier
        this.loading[identifier] = true
        this.update()
        if (!identifier) return showAlertError(new Error('Invalid Identifier File'))
        reportValidationDownloadFileAggregator({ identifier, filename: true })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(filename => {
                if (!filename) {
                    this.loading[identifier] = false
                    this.update()
                    return false
                }
                reportValidationDownloadFileAggregator({ identifier })
                    .catch(err2 => {
                        showAlertError(err2)
                        return null
                    })
                    .then(data => {
                        this.loading[identifier] = false
                        this.update()
                        if(!data) return false
                        downloadFile(filename, data)
                    })
            })
    }
}