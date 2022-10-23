import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    pushNotifList,
    pushNotifSchedule,
} from 'appModule/push-notification/push-notification.sdk'
import { goTo } from 'helpers/ma'
import moment from 'moment'
import { showAlertError, randomString } from 'helpers/utilities'
import { changeStorage, deleteStorage } from 'helpers/storage'

export default {
    onBeforeMount() {
        this.access = {
            create: false,
            edit: false,
            reporting: false,
            delete: false
        }
        deleteStorage('NOTIFICATION_DATA_EDIT')
        deleteStorage('NOTIFICATION_DETAIL')
        this.form = {
            searchId: randomString(10, {onlyChars: true}),
            date: {
                since: moment().format('YYYY-MM-DD'),
                until: ''
            },
            dropdown_list: [
                {name: 'DRAFT', title: 'DRAFT'},
                {name: 'WAITING_FOR_APPROVAL', title: 'WAITING FOR APPROVAL'},
                // {name: 'IN_PROGRESS', title: 'IN PROGRESS'},
                // {name: 'REJECT', title: 'REJECT'},
                {name: 'CANCELLED_BY_CHECKER', title: 'CANCELLED BY CHECKER'},
                {name: 'SCHEDULED', title: 'SCHEDULED'}
            ]
        }
        this.listItems = []
        this.pagination = {
            hasPrev: false,
            currentPage: 1,
            hasNext: false,
        }
        this.buttons = {
            search: {
                loading: false
            }
        }
        this.tableComponents = {
            isLoading: false
        }
        this.searchComponents = {
            keyword: false,
            status: '',
            limit: 10,
            page: 1
        }
        this.dataInformation = {
            availableLimits: [10, 20, 50, 100],
            availablePages: 1,
        }
        this.modals = {
            comments: {
                show: false
            },
            previewAttachment: {
                show: false
            },
            reportTable: {
                show: false
            }
        }
        this.filters = {
            status: null
        }
        this.search = {
            status: null
        }
        this.sorts = {
            id: 'asc',
            status: null,
            startDate: null,
        }
    },
    onMounted() {
        this.getData()
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    // main functions
    getQueries() {
        let q = {}
        for (const s in this.searchComponents) {
            if (this.searchComponents[s]) q[s] = this.searchComponents[s]
        }
        return q
    },
    async getData() {
        try {
            this.tableComponents.isLoading = true
            this.update()
            const queries = this.getQueries()
            const res = await pushNotifList(queries)
            this.listItems = res.data.map((x, i) => {
                x.n = parseInt(i) + (this.searchComponents.limit * (this.searchComponents.page - 1)) + 1
                return x
            })
            this.pagination.hasNext = true
            this.pagination.hasPrev = true
            if (this.searchComponents.page === res.totalPage) this.pagination.hasNext = false
            if (this.searchComponents.page <= 1) this.pagination.hasPrev = false
            this.access = res.access
            this.dataInformation = {
                availablePages: res.totalPage || 1
            }
            this.tableComponents.isLoading = false
            this.update()
        } catch (err) {
            showAlertError(err)
        }
    },
    // callbacks 
    changeLimit(newLimit) {
        this.searchComponents.limit = newLimit
        this.getData()
    },
    createNew(data) {
        console.log(data)
    },
    setStatus(data) {
        this.searchComponents.status = data.value
    },
    setDate(res) {
        this.searchComponents.date = ''
        if (res.date && res.date) this.searchComponents.date = res.date.format('YYYY-MM-DD HH:mm:SS')
    },
    doSearch() {
        this.searchComponents.page = 1
        this.dataInformation.currentPage = 1
        this.searchComponents.keyword = this.$('#' + this.form.searchId).value
        this.getData()
    },
    paginationCallback(data) {
        this.pagination.currentPage = data.page
        this.searchComponents.page = data.page
        this.searchComponents.limit = data.limit
        this.getData()
    },
    editItem(res) {
        this.getFullData(res.data)
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(data => {
                if (!data) return false
                changeStorage({
                    'DATA_EDIT': JSON.stringify(data)
                }, 'NOTIFICATION')
                goTo('notification/edit')
            })
    },
    async getFullData(data) {
        try {
            const masterId = data.id
            if (!masterId) throw new Error('Invalid MasterId')
            data.schedule = await this.getSchedule(masterId)
            return data
        } catch (err) {
            throw err
        }
    },
    async getSchedule(masterId) {
        try {
            const sc = await pushNotifSchedule({ master_id: masterId })
            return sc.data
        } catch (err) {
            throw err
        }
    },
    cancelItem(res) {
        console.log(res)
    },
    goToReportingPage(data) {},
    goToCreateNewPage(data) {
        goTo('notification/create')
    },
    viewAttachments(res) {
        this.modals.previewAttachment.data = res.data
        this.modals.previewAttachment.show = true
        this.update()
    },
    viewComments(res) {
        this.modals.comments.show = true
        this.modals.comments.data = res.data
        this.update()
    },
    viewDetails(res) {
        changeStorage({
            'DETAIL': JSON.stringify({
                ...res.data,
                actions: this.access,
                goBackURL: 'notification/my-list'
            })
        }, 'NOTIFICATION')
        goTo('notification/details')
    },
    disableModal({ refresh }) {
        this.modals.comments.show = false
        this.modals.previewAttachment.show = false
        this.modals.reportTable.show = false
        this.update()
    },
    showReport(res) {
        const data = res.data
        this.modals.reportTable.show = true
        this.modals.reportTable.data = data
        this.update()
    }
}