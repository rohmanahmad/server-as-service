import { Request } from 'services/SDK/main'

const R = new Request()

export const getListTask = function (params) {
    return R.init().get('/api/v1.0/tasks/pending/search', params)
}

export const ApproveRequestTask = function (endpoint, form) {
    return R.init().post(endpoint, form)
}

export const RejectRequesTask= function (endpoint, form) {
    return R.init().post(endpoint, form)
}

export const PendingCount = function () {
    return R.init().get('/api/v1.0/tasks/pending/count')
}