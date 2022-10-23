import { Request } from 'services/SDK/main'

const R = new Request()

export const BlockActivation= function (endpoint) {
    return R.init().get(endpoint)
}

export const BlockCustomers = function (endpoint) {
    return R.init().get(endpoint)
}

export const CustomerList = function (data) {
    return R.init().get('/api/v1.0/customers/search', data)
}

export const getCustomers = function (params) {
    return R.init().get('/api/v1.0/customers/search', params)
}
export const getDetailCustomers = function (params) {
    return R.init().get('/api/v1.0/customers/detail?' + params)
}

export const getHistoryCustomers = function (endpoint, params) {
    return R.init().get(endpoint, params)
}

// export const getHistoryBlockUnblockCustomers = function (endpoint, params) {
//       return R.init().get(endpoint, params)
// }

export const getHistoryBlockUnblockCustomers = function (endpoint, params) {
    return R.init().get(endpoint, params)
}

export const UnBlockCustomers = function (endpoint) {
    return R.init().get(endpoint)
}

export const ReportList = function (params) {
    return R.init().get('/api/v1.0/report/activities', params)
}

export const GetReportPermission = function (params) {
    return R.init().get('/api/v1.0/report/permission', params)
}

export const getPaylaterDetail = function (params) {
    return R.init().get('/api/v1.0/paylater/summary', params)
}
export const doRequestRepayment = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/paylater/request/repayment', payload, opt)
}

export const sendRequest = function (type = 'get', url, params) {
    if (type === 'get') return R.init().get(url, params)
    if (type === 'post') return R.init().post(url, params)
}