import {
    cancelAllRequest,
} from 'services/SDK/main'
import { settlementStatusList, settlementStatusDownload } from 'appModule/billpayment/billpayment.sdk'
// import { settlementStatusList } from 'appModule/billpayment/billpayment.sdk.dummy'
import { showAlertError, debugLog } from 'helpers/utilities'
import { result } from 'lodash'
import downloadFile from 'js-file-download'

export default {
    onBeforeMount() {
        this.search = {}
        this.search.start = moment().format('YYYY-MM-DD')
        this.search.end = moment().format('YYYY-MM-DD')
        this.search.billers = 'ALL'
        this.buttons = {}
        this.buttons.generate = false
        this.actions = {}
        this.actions.download = false
        this.modal = {}
        this.modal.show = false
        this.table = {}
        this.table.empty = false
        this.table.items = []
        this.table.loadingData = false
        this.table.config = {}
        this.table.config.limit = 5
        this.table.config.page = 1
        this.access = {}
        this.download = {isDownloading: false}
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.getItems()
    },
    onUpdated() {
        debugLog(`[${this.name}] [UPDATED]`)
    },
    searchData() {
        this.getItems()
    },
    downloadStatusSettlement(res) {
        if (!this.urlDownload) return showAlertError(new Error('No Download URL Available'))
        window.open(this.urlDownload)
    },
    /* downloadSelected() {
        this.download.isDownloading = true
        this.update()
        let billers = this.search.billers
        if (!billers) billers = ['ALL'] // hanya sementara sampai search bisa accept billers
        settlementStatusDownload({ billers,  filename: true })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(filename => {
                if (!filename) {
                    this.download.isDownloading = false
                    this.update()
                    return false
                }
                settlementStatusDownload({ ...this.search, billers })
                    .catch(err => {
                        showAlertError(err)
                        return null
                    })
                    .then(data => {
                        this.download.isDownloading = false
                        this.update()
                        if (!data) return false
                        downloadFile(data, filename)
                    })
            })
    }, */
    async getItems() {
        try {
            this.table.loadingData = true
            this.update()
            if (!this.search.billers) this.search.billers = 'ALL'
            const res = await settlementStatusList(this.search)
            const items = result(res, 'data.items', [])
            this.access = result(res, 'data.access', {})
            const opt = result(res, 'data.options', {})
            const userid = opt.userid
            let q = Object.keys(this.search)
                .map((key) => {
                    return ([key, this.search[key]]).join('=')
                })
            this.urlDownload = opt.billURL + opt.billStatusSettlementDownloadPath + '?' + q.join('&') + '&userId=' + userid
            if (items.length === 0) this.table.empty = true
            else this.table.empty = false
            this.table.items = items.map((x, i) => {
                x.n = parseInt(i) + 1
                return x
            })
            this.table.loadingData = false
            this.update()
        } catch (err) {
            showAlertError(err)
        }
    },
    cbModal() {
        this.modal.show = false
        this.update()
    },
    download() {
    },
    showModalGenerate() {
        this.modal.show = true
        this.update()
    },
    updateSearchPayload(field, res={}) {
        if (['start', 'end'].indexOf(field) > -1) this.search[field] = res.date.format('YYYY-MM-DD')
        else if (field === 'billers') this.search[field] = res.join()
        else if (field === 'status') this.search[field] = res.name
    },
}