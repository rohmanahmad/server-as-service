/*
@deprecated (NO_LOGGER_USED)
const componentSDK = require('appModule/billpayment/@components/billpayment-components.sdk')
const inquirySDK = require('appModule/billpayment/settlement-tools/inquiry/billpayment-inquiry.sdk')
const masterdbSDK = require('appModule/billpayment/settlement-tools/masterdb/billpayment-masterdb.sdk')
const statusSettlementSDK = require('appModule/billpayment/settlement-tools/status-settlement/billpayment-status.sdk')
const userDownloadSDK = require('appModule/billpayment/settlement-tools/user-download/billpayment-user-download.sdk')
console.log(componentSDK)
export default {
    ...componentSDK,
    ...inquirySDK,
    ...masterdbSDK,
    ...statusSettlementSDK,
    ...userDownloadSDK
}
*/

import { Request } from 'services/SDK/main'

const R = new Request()

/* COMPONENTS */

export const getBillerProviders = function (payload={}, opt) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/components/biller-provider-list', payload, opt)
}
export const getProductCodes = function (payload={}, opt) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/components/product-category-list', payload, opt)
}

/* MASTERDB */

export const masterdbGetList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/masterdb/list', payload, opt)
}

export const masterdbCreateNew = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/bill-payment/settlement-tools/masterdb/create', payload, opt)
}

/* 
@deprecated (NO_LOGGER_USED)
export const getMasterBankList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/components/bank-list', payload, opt)
}
*/

export const masterdbUpdate = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/bill-payment/settlement-tools/masterdb/update', payload, opt)
}

export const masterdbSendCommand = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/bill-payment/settlement-tools/masterdb/execute-command', payload, opt)
}

export const masterdbDownloadHistory = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/masterdb/logs/download', payload, opt)
}

export const getSettlementReportValidation = function (payload={}) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/report-validation/list', payload)
}

export const generateSettlementReportValidation = function (payload={}) {
    return R.init().post('/api/v1.0/bill-payment/settlement-tools/report-validation/generate', payload)
}

export const downloadAggregatorFile = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/report-validation/download-aggregator', payload, opt)
}

export const masterdbHistoryList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/masterdb/history/list', payload, opt)
}

/* INQUIRY */

export const settlementToolsInquiry = function (payload={}, opt) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/inquiry', payload, opt)
}

export const settlementToolsInquirySendCommand = function (payload={}, opt) {
    return R.init().post('/api/v1.0/bill-payment/settlement-tools/inquiry/send-command', payload, opt)
}

export const settlementToolsInquiryDownloadTrx = function (payload={}, opt) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/inquiry/download', payload, opt)
}

export const settlementToolsInquiryUpdate = function (payload={}, opt) {
        return R.init().post('/api/v1.0/bill-payment/settlement-tools/inquiry/update', payload, opt)
}

/* SETTLEMENT STATUS */

export const settlementStatusList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/status-settlement/list', payload, opt)
}
export const settlementStatusDownload = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/status-settlement/download', payload, opt)
}

/* USER DOWNLOAD LIST */

export const userDownloadList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/user-download/list', payload, opt)
}

/* REPORT VALIDATION STATUS */

export const reportValidationList = function (payload={}, opt) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/report-validation/list', payload, opt)
}

export const reportValidationSendCommand = function (payload={}, opt) {
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/report-validation/command', payload, opt)
}

export const reportValidationDownloadFileAggregator = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/report-validation/download-aggregator-file', payload, opt)
}

export const reportValidationDownloadTransactionDetails = function (payload, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/bill-payment/settlement-tools/report-validation/download-trx-details', payload, opt)
}