import { isArray, sample, random, isFunction } from 'lodash'
import uuid from 'uuid'
import { randomString } from 'helpers/utilities'
import { settlementReportValidationStatuses } from 'appModule/billpayment/billpayment.config'

const templateData = {
    "settlementDate": String,
    "referenceNumber": String,
    "billerProviderName": String,
    "productCategory": ['OPAY', 'OBTB'],
    "productCodeFcubs": [7901, 7500],
    "ptbcEscrowAccountNumber": String,
    "counterPartyName": ['Artajasa', 'Mitracomm'],
    "partnerBankAccountNumber": String,
    "partnerBankDestinationName": String,
    "settlementAmount": Number,
    "totalTransaction": Number,
    "ptbcFee": Number,
    "aggregatorFee": Number,
    "ttc": Number,
    "remarks": String,
    "settlementPaymentMethod": ["RTGS", "SKN"],
    "status": String,
    "fileIdentifier": String,
    "attempts": Number,
    "submittedBy": ["ptbcsuper"],
    "submittedOn": Date,
    "authorizedBy": ["ptbcsuper"],
    "authorizedOn": Date,
    "createdBy": ["ptbcsuper"],
    "createdOn": Date,
    "lastModifiedBy": null,
    "lastModifiedOn": null,
    "logs": [
        {
            "status": "NEW",
            "processedOn": "2022-05-12T05:04:09.737Z",
            "processedBy": "Jane.Doe"
        }
    ]
}
const getInquiry = function () {
    const limit = sample([0, 1, 3])
    let items = []
    for (let n = 1; n<=limit; n++) {
        let obj = {}
        for (const key in templateData) {
            let val = templateData[key]
            if (isArray(val)) {
                val = sample(val)
            } else if (isFunction(val)) {
                if (val.name === 'String') {
                    switch(key) {
                        case 'ptbcEscrowAccountNumber':
                            val = randomString(10, {onlyNums: true})
                        break
                        case 'fileIdentifier':
                            val = uuid().replace(/\-/g, '')
                        break
                        case 'totalTransaction':
                            val = random(1, 10).toString()
                        break
                        case 'status':
                            val = sample(Object.keys(settlementReportValidationStatuses))
                        break
                        default:
                            val = `${key}[${n}]`
                    }
                } else if (val.name === 'Number') {
                    val = random(10)
                    switch(key) {
                        case 'settlementAmount':
                            val = random(10 * 1000, 100 * 10 * 10 * 1000)
                        break;
                        case 'ttc':
                            val = random(100, 200)
                        break;
                    }
                } else if (val.name === 'Date') {
                    val = new Date().toISOString()
                }
            }
            obj[key] = val
        }
        items.push(obj)
    }
    const access = {
        // maker
        confirm: true,
        edit: true,
        // checker
        authorize_reject: true,
    }
    return {data: {items, access}}
}
export const settlementToolsInquiry = getInquiry
export const reportValidationList = getInquiry

const templateStatusSettlement = {
    "referenceNumber": "PTBC_BillPayment_000000",
    "billerProviderName": ["OVO", "PLN", "DANA"],
    "attempt": [1,2,3,4,5,6],
    "errorMessage": ['I/O error on POST request for \"http://localhost:8081/transaction/post\": Connection refused (Connection refused); nested exception is java.net.ConnectException: Connection refused (Connection refused)'],
    "status": ["Failed", "Success"],
    "ptbcEscrowAccountNumber": ["0112992882", "99289920091", "772882772881"],
    "partnersBankAccountNumber": ["110112992882", "2299289920091", "33772882772881"],
    "payload": null,
    "processedOn": '',
    "processedBy": ["System"]
}

export const settlementStatusList = function () {
    let limit = sample([0, 2, 3, 5])
    let items = []
    for (let i = 1; i <= limit; i++) {
        let obj = {}
        for (const k in templateStatusSettlement) {
            let val = templateStatusSettlement[k]
            if (k !== 'referenceNumber') {
                if (isArray(val)) {
                    val = sample(val)
                } else if (k === 'processedOn') {
                    val = new Date().toISOString()
                }
            } else {
                val += i
            }
            obj[k] = val
        }
        items.push(obj)
    }
    const access = {
        // maker
        generate: true,
        download: true
    }
    return {data: {items, access}}
}

// user download list

const templateUserDownloadList = {
    "downloadedBy": "Jane.Due",
    "downloadedOn": "2022-05-17T01:59:14.267Z",
    "settlementProcessedOn": "2022-05-16T18:44:01.38Z",
    "referenceNumber": "PTBC_BillPayment_000000",
    "billerProviderName": "OVO",
    "status": "Failed"
}

export const userDownloadList = function () {
    const limit = sample([0, 3, 5])
    let items = []
    for (let i = 0; i < limit; i++) {
        let obj = {}
        for (const key in templateUserDownloadList) {
            let value = templateUserDownloadList[key]
            switch(key) {
                case 'downloadedBy':
                    value = sample(['ptbcsuper'])
                    break;
                case 'downloadedOn':
                    value = new Date().toISOString()
                break
                case 'settlementProcessedOn':
                    value = new Date((new Date().getTime() - 1000*60*60*30)).toISOString()
                break
                case 'billerProviderName':
                    value = sample(['OVO', 'DANA'])
                break
                case 'status':
                    value = sample(['Failed', 'Success'])
                break
                default:
                    value += i
                break
            }
            obj[key] = value
        }
        items.push(obj)
    }
    return {
        data: {
            items,
            totalPages: 1,
            totalRows: limit
        }
    }
}