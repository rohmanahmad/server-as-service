import {
    cancelAllRequest,
} from 'services/SDK/main'
import { userDownloadList } from 'appModule/billpayment/billpayment.sdk'
// import { userDownloadList } from 'appModule/billpayment/billpayment.sdk.dummy'
import { showAlertError, debugLog } from 'helpers/utilities'
import { result } from 'lodash'

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
        this.modals = {}
        this.modals.generate = {}
        this.modals.generate.show = false
        this.table = {}
        this.table.empty = true
        this.table.items = []
        this.table.loadingdata = false
        this.table.config = {}
        this.table.config.limit = 5
        this.table.config.page = 1
        this.access = {}
        this.download = { enabled: false }
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onUpdated() {
        debugLog(`[${this.name}] [UPDATED]`)
    },
    cbBtnGenerate() {
        this.getItems()
    },
    async getItems() {
        try {
            this.table.loadingdata = true
            this.table.empty = false
            this.update()
            if (!this.search.billers) this.search.billers = 'ALL'
            const res = await userDownloadList(this.search)
            const items = result(res, 'data.items', [])
            if (items.length === 0) this.table.empty = true
            else {
                this.table.empty = false
                this.download.enabled = true
            }
            this.table.items = items.map((x, i) => {
                x.n = parseInt(i) + 1
                return x
            })
            this.table.loadingdata = false
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
        alert('download transaction detail')
    },
    showModalGenerate() {
        this.modal.show = true
        this.update()
    },
    updateSearchPayload(field, res={}) {
        if (['start', 'end'].indexOf(field) > -1) this.search[field] = res.since.format('YYYY-MM-DD')
        else if (field === 'billers') this.search[field] = res.join()
        else this.search[field] = res.value
        console.log(this.search)
    },
}