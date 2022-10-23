import {
    cancelAllRequest,
} from 'services/SDK/main'
import { result } from 'lodash'
import {
    settlementToolsInquirySendCommand,
    settlementToolsInquiryDownloadTrx,
    reportValidationSendCommand,
    settlementToolsInquiry
} from 'appModule/billpayment/billpayment.sdk'
// import { settlementToolsInquiry } from 'appModule/billpayment/billpayment.sdk.dummy'
import { showAlertError, showAlertSuccess, randomString, formatNumber, debugLog } from 'helpers/utilities'
import { settlementReportValidationStatuses } from 'appModule/billpayment/billpayment.config'
import downloadFile from 'js-file-download'


export default {
    init() {
        this.dataInformation = {
            availableLimits: [10, 20, 50, 100],
            availablePages: 3,
            currentPage: 1,
        }
        this.pagination = {
            hasPrev: false,
            hasNext: 1,
        }
        this.loadingAuthorize = {}
        this.checkedItems = []
        this.initFilterAndSearch()
        this.initTable()
        this.initModal()
    },
    onBeforeMount() {
        this.init()
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
        this.search.start = moment('2022-03-01').format('YYYY-MM-DD')
        this.search.end = moment().format('YYYY-MM-DD')
        // this.search.status = 'ALL' // status blm ready di mb. wulan
        this.search.billers = 'ALL'
    },
    initModal() {
        this.modals = {
            updateSettlement: {
                show: false
            },
            showDetail: {
                show: false
            }
        }
    },
    updateSearchPayload(field, res={}) {
        if (['start', 'end'].indexOf(field) > -1) this.search[field] = res.date.format('YYYY-MM-DD')
        else if (field === 'billers') {
            if (res.length === 0) res = ['ALL']
            this.search[field] = res.join()
        }
        else if (field === 'status') this.search[field] = res.name
    },
    async getData () {
        this.table.loadingdata = true
        this.checkedItems = []
        this.update()
        try {
            const q = Object.keys(this.search || {})
                .map(x => ({ key: x, value: this.search[x] }))
                .reduce((r, x) => {
                    if (x.value) r[x.key] = x.value
                    return r
                }, {})
            const res = await settlementToolsInquiry(q)
            const items = result(res, 'data.items', [])
            this.access = result(res, 'data.access', {})
            this.table.isNoData = true
            if (items) {
                this.table.items = items.map((x, i) => {
                    x.n = parseInt(i) + 1
                    x.statusFormatted = settlementReportValidationStatuses[x.status]
                    x.settlementAmount = formatNumber(x.settlementAmount)
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
        this.modals.updateSettlement.item = item
        this.modals.updateSettlement.show = true
        this.update()
    },
    searchData() {
        this.getData()
    },
    paginationCallback(res) {
        debugLog(res)
    },
    doView(e, item) {
        if (e && e.preventDefault) e.preventDefault()
        this.modals.showDetail.item = item
        this.showModalView()
    },
    async sendCommand(referenceNumber, commandType, value) {
        await settlementToolsInquirySendCommand({ referenceNumber, commandType, value })
    },
    downloadTransaction(res) {
        settlementToolsInquiryDownloadTrx({filename: true})
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(filename => {
                if (!filename) return false
                settlementToolsInquiryDownloadTrx()
                    .catch(err2 => {
                        showAlertError(err2)
                        return null
                    })
                    then(data => {
                        downloadFile(data, filename)
                    })
            })
    },
    updateSettlement(resFromModal) {
        this.modals.updateSettlement.show = false
        this.update()
    },
    doAuthorize(e, item) {
        if (e && e.preventDefault) e.preventDefault()
        const conf = confirm('Are You Sure To Authorize??')
        if (!conf) return null
        const refN = item.referenceNumber
        this.loadingAuthorize[refN] = true
        this.update()
        this.sendCommand(refN, 'AUTHORIZE')
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.getData()
                this.loadingAuthorize[refN] = true
                this.update()
                if (!res) return false
                showAlertSuccess()
            })
    },
    async sendCommand(referenceNumber, commandType) {
        try {
            if (!referenceNumber || (referenceNumber && referenceNumber.length === 0)) throw new Error('ReferenceId Required')
            await reportValidationSendCommand({ referenceNumber, commandType })
            showAlertSuccess()
        } catch (err) {
            showAlertError(err)
        }
    },
    showModalView() {
        this.modals.showDetail.show = true
        this.update()
    },
    cbModalView() {
        this.modals.showDetail.show = false
        this.update()
    }
}