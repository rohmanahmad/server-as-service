import {
    cancelAllRequest,
    // settlement tools api
} from 'services/SDK/main'
import {
    masterdbGetList,
    masterdbSendCommand,
    masterdbDownloadHistory
} from 'appModule/billpayment/billpayment.sdk'
import downloadFile from 'js-file-download'
import { result } from 'lodash'
import { goTo } from 'helpers/ma'
import { showAlertError, showAlertSuccess, debugLog } from 'helpers/utilities'
import { settlementAmountTypes, masterdbStatusMap, masterdbStatusMatrixMap } from 'appModule/billpayment/billpayment.config'
const settlementAmountTypesObj = settlementAmountTypes.reduce((r, x) => {
    r[x.name] = x.title
    return r
}, {})

export default {
    goTo,
    onBeforeMount() {
        this.initTable()
        this.initFilterAndSearch()
        this.initModal()
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.getData()
    },
    // initiate table
    initTable() {
        this.table = {}
        this.table.isNoData = false
        this.table.loadingData = true
        this.table.items = []
    },
    initFilterAndSearch() {
        this.search = {}
        this.access = {}
    },
    initModal() {
        this.modals = {}
        this.modals.addedit = { enabled: false, editMode: false, data: null }
        this.modals.edit = { enabled: false, data: {} }
        this.modals.download = { enabled: false, data: {} }
    },
    updateDate({name, since: d}) {
        const value = d.format('YYYY-MM-DD')
        this.search[name] = value
        debugLog(name, value)
    },
    updateBillerProviderName(items) {
        this.search.billerProviderName = items.map(x => x.name).join()
        debugLog('selected:', this.search.billerProviderName)
    },
    async getData () {
        this.table.loadingData = true
        this.update()
        try {
            const q = Object.keys(this.search)
                .map(x => ({ [x]: this.search[x] }))
                .reduce((r, x) => {
                    const k = Object.keys(x)[0]
                    r[k] = x[k]
                    return r
                }, {})
            const res = await masterdbGetList(q)
            const items = result(res, 'data.items', [])
            this.access = result(res, 'data.access', {})
            if (items) {
                this.table.items = items.map((x, i) => {
                    x.n = parseInt(i) + 1
                    x.logs = x.logs[x.logs.length-1]
                    if (x.logs.changeRows ) {
                        x.changeRows = x.logs.changeRows
                    }
                    if (masterdbStatusMap[x.status]) x.statusText = masterdbStatusMap[x.status]
                    if (masterdbStatusMatrixMap[x.statusMatrix]) x.statusMatrixText = masterdbStatusMatrixMap[x.statusMatrix]
                    if (settlementAmountTypesObj[x.settlementAmount]) x.settlementAmountText = settlementAmountTypesObj[x.settlementAmount]
                    x.actions = {}
                    const status = x.status.toLowerCase()
                    switch(status) {
                        case 'need_checker_to_authorize':
                            if (this.access.authorize_reject) {
                                x.actions['reject'] = true
                                x.actions['authorize'] = true
                            }
                        break
                        case 'no_action_required':
                            if (this.access.edit) x.actions.edit = true
                        break
                        case 'reject_from_checker':
                            if (this.access.edit) x.actions.edit = true
                        break
                        // case 'no_longer_used': // semua button disabled
                        //     break
                        // case 'cancel_from_checker': // semua button disabled
                        // break
                    }
                    if (x.statusMatrix === 'INACTIVE') x.actions.edit = true
                    if (this.access.cancel && ['need_checker_to_authorize', 'reject_from_checker'/* , 'no_action_required' */].indexOf(status) > -1) x.actions.cancel = true
                    return x
                })
                if (items.length === 0) this.table.isNoData = true
                this.update()
            }
        } catch (err) {
            showAlertError(err)
        }
        this.table.loadingData = false
        this.update()
    },
    openModalAddNewData() {
        this.modals.addedit.editMode = false
        this.modals.addedit.data = {}
        this.modals.addedit.enabled = true
        this.update()
    },
    showModalDownloadHistory(res) {
        this.modals.download.enabled = true
        this.update()
    },
    // callbacks
    callbackModalAddEdit(res) {
        this.modals.addedit.editMode = false
        this.modals.addedit.enabled = false
        this.modals.addedit.data = null
        if (res.refresh) this.getData()
    },
    callbackModalDownload() {
        this.modals.download.enabled = false
    },
    actionCallback(res) {
        console.log(res)
    },
    doCancel (res) {
        const conf = confirm('Are You Sure To Cancel??')
        if (!conf) return null
        const partnerCode = result(res, 'data.partnerCode')
        if (!partnerCode) return showAlertError(new Error('Invalid PartnerCode'))
        masterdbSendCommand({action: 'CANCEL_CHECKER', partnerCode})
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(r => {
                if (!r) return null
                showAlertSuccess('Cancelled')
                this.getData()
            })
    },
    doEdit (res) {
        this.modals.addedit.editMode = false
        this.modals.addedit.data = res.data
        this.modals.addedit.enabled = true
        this.update()
    },
    doAuthorize (res) {
        const conf = confirm('Are You Sure To Authorize??')
        if (!conf) return null
        const partnerCode = result(res, 'data.partnerCode')
        if (!partnerCode) return showAlertError(new Error('Invalid PartnerCode'))
        masterdbSendCommand({action: 'AUTHORIZE', partnerCode})
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(r => {
                if (!r) return null
                showAlertSuccess('Authorized')
                this.getData()
            })
    },
    doReject (res) {
        const conf = confirm('Are You Sure To Reject??')
        if (!conf) return null
        const partnerCode = result(res, 'data.partnerCode')
        if (!partnerCode) return showAlertError(new Error('Invalid PartnerCode'))
        masterdbSendCommand({action: 'REJECT', partnerCode})
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(r => {
                if (!r) return null
                showAlertSuccess('Rejected')
                this.getData()
            })
    },
    downloadHistory(res) {
        try {
            const billerName = result(res, 'data.billerProviderName')
            if (!billerName) throw new Error('Invalid Provider Name')
            masterdbDownloadHistory({ billers: billerName, filename: true })
                .catch(err => {
                    throw err
                })
                .then(filename => {
                    masterdbDownloadHistory({ billers: billerName })
                        .catch(err => {
                            throw err
                        })
                        .then(data => {
                            downloadFile(data, filename)
                        })
                })
        } catch (err) {
            showAlertError(err)
        }
    },
}