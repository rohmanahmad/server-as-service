import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    pushNotifList,
    deactivateNotif,
} from 'appModule/push-notification/push-notification.sdk'
import { result } from 'lodash'
import { goTo } from 'helpers/ma'
import { showAlertError, randomString, showAlertSuccess } from 'helpers/utilities'
import { changeStorage } from 'helpers/storage'

export default {
    onBeforeMount() {
        this.access = {
            create: false,
            edit: false,
            reporting: false,
            delete: false
        }
        this.form = {
            searchId: randomString(10, {onlyChars: true}),
        }
        this.listItems = []
        this.buttons = {
            search: {
                loading: false
            }
        }
        this.pagination = {
            hasPrev: false,
            currentPage: 1,
            hasNext: false,
        }
        this.tableComponents = {
            isLoading: false,
            checkall: {},
            selectedRows: {},
        }
        this.searchComponents = {
            keyword: null,
            status: 'WAITING_FOR_APPROVAL',
            sort: 'CREATED_AT',
            sortOrder: 'DESC',
            limit: 10,
            page: 1
        }
        this.dataInformation = {
            availableLimits: [10, 20, 50, 100],
            availablePages: 1,
        }
        this.modals = {
            approval: {
                selectedData: {}
            }
        }
        this.sorts = {
            activityDate: 'desc'
        }
        this.search = {}
        this.filters = {}
        this.statusDropdownItem = [
            { name: 'WAITING_FOR_APPROVAL', title: 'Waiting For Approval' },
            { name: 'SCHEDULED', title: 'Scheduled' },
        ]
    },
    onMounted() {
        this.getData()
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    getQueries() {
        let q = {}
        for (const s in this.searchComponents) {
            if (this.searchComponents[s]) q[s] = this.searchComponents[s]
        }
        return q
    },
    doSearch() {
        this.searchComponents.page = 1
        this.dataInformation.currentPage = 1
        this.searchComponents.keyword = this.$('#' + this.form.searchId).value
        this.getData()
    },
    // main functions
    async getData() {
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
    },
    // callbacks 
    goToReportingPage(data) {},
    goToCreateNewPage(data) {},
    getAttachments(data) {},
    getComments(data) {},
    paginationCallback(data) {
        this.pagination.currentPage = data.page
        this.searchComponents.page = data.page
        this.searchComponents.limit = data.limit
        this.getData()
    },
    // modal
    showApprovalDialog (res) {
        this.modals.approval.show = true
        this.modals.approval.selectedData = res.data
        this.update()
    },
    approvalCallback(res) {
        this.modals.approval.show = false
        this.update()
        this.doSearch()
    },
    viewDetails(res) {
        changeStorage({
            'DETAIL': JSON.stringify({
                ...res.data,
                // actions: this.access,
                goBackURL: 'notification/my-pending-approval'
            })
        }, 'NOTIFICATION')
        goTo('notification/details')
    },
    cancelDialog(res) {
        const c = confirm('Change Notification To "CANCELLED_BY_CHECKER" Status?')
        if (!c) return null
        const masterId = result(res, 'data.id')
        deactivateNotif(masterId)
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                if (res) showAlertSuccess('Notification Change To CANCELLED_BY_CHECKER')
                this.doSearch()
            })
    },
    setStatus(res) {
        this.searchComponents.status = res.value
    }
}