
        import {
            cancelAllRequest,
            // settlement tools api
        } from 'services/SDK/main'
        import {
            masterdbHistoryList,
            masterdbDownloadHistory
        } from 'appModule/billpayment/billpayment.sdk'
        import downloadFile from 'js-file-download'
        import { result } from 'lodash'
        import { showAlertError, debugLog } from 'helpers/utilities'

export default {
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
        // this.getData()
    },
    // initiate table
    initTable() {
        this.table = {}
        this.table.isNoData = true
        this.table.loadingData = false
        this.table.items = []
        this.pagination = {}
        this.pagination.availableLimits = [10, 20, 50, 100]
        this.pagination.hasPrev = false
        this.pagination.currentPage = 1
        this.pagination.hasNext = false
        this.pagination.availablePages = 1
    },
    initFilterAndSearch() {
        this.searchData = {}
        this.searchData.pageIndex = 0
        this.searchData.size = 10
        this.searchData.billers = ''
        this.searchData.processedOn = moment().format('YYYY-MM-DD')
    },
    initModal() {
        this.modals = {}
        this.modals.download = { enabled: false, data: {} }
    },
    updateSearchPayload(key, res) {
        if (key === 'processedOn') this.searchData[key] = res.date.format('YYYY-MM-DD') // @deprecated res.since => change to res.date
        else this.searchData[key] = res.join()
    },
    paginationCallback(data) {
        if (data.page > 0) this.searchData.pageIndex = data.page -1
        if (data.limit > 0) this.searchData.size = data.limit
        this.pagination.currentPage = data.page
        this.doSearch()
    },
    doSearch() {
        this.getData()
    },
    async getData () {
        this.table.isNoData = false
        this.table.loadingData = true
        this.update()
        try {
            const q = Object.keys(this.searchData)
                .map(x => ({ [x]: this.searchData[x] }))
                .reduce((r, x) => {
                    const k = Object.keys(x)[0]
                    r[k] = x[k]
                    return r
                }, {})
            const res = await masterdbHistoryList(q)
            const items = result(res, 'data.items', [])
            this.options = result(res, 'data.options', {})
            this.pagination.availablePages = result(res, 'data.totalPages', 1)
            this.pagination.hasNext = true
            this.pagination.hasPrev = true
            if (this.pagination.currentPage === this.pagination.availablePages) this.pagination.hasNext = false
            if (this.pagination.currentPage <= 1) this.pagination.hasPrev = false
            if (items) {
                this.table.items = items.map((x, i) => {
                    x.n = parseInt(i) + 1
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
    downloadSelected() {
        let billers = this.searchData.billers
        if (!billers) billers = ['ALL'] // hanya sementara sampai search bisa accept billers
        masterdbDownloadHistory({ billers: billers.join(),  filename: true })
            .catch(err => {
                throw err
            })
            .then(filename => {
                masterdbDownloadHistory({ ...this.searchData, billers: billers.join() })
                    .catch(err => {
                        throw err
                    })
                    .then(data => {
                        downloadFile(data, filename)
                    })
            })
    },
    directDownloadSelected() {
        let billers = this.searchData.billers
        let processedOn = this.searchData.processedOn
        if (!billers) billers = ['ALL'] // hanya sementara sampai search bisa accept billers
        const { billURL, billMasterHistoryDownloadPath } = this.options
        if (!billURL || !billMasterHistoryDownloadPath) return showAlertError(new Error('Invalid Download URL or Download Path'))
        const fullUrl = billURL + billMasterHistoryDownloadPath + '?processedOn=' + processedOn + '&billers=' + billers
        window.open(fullUrl)
    },
}