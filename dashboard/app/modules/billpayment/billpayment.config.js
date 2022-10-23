export const partners = [
    {name: 'Mitracomm', title: 'PT. MITRACOMM EKASARANA'},
    {name: 'Artajasa', title: 'PT. ARTAJASA PEMBAYARAN ELEKTRONIS'},
]

export const productCodes = [
    {
        name: 'OBTB',
        title: 'OBTB',
        fcubs: '7901'
    },
    {
        name: 'OPAY',
        title: 'OPAY',
        fcubs: '7500'
    }
]

export const settlementAmountTypes = [
    {name: 'LESS_THAN_BIO', title: '< 1 Bio'},
    {name: 'GREATER_THAN_BIO', title: '> 1 Bio'},
    {name: 'NO_LIMIT', title: 'No Limit'},
]

export const masterdbStatusMap = {
    'NO_ACTION_REQUIRED': 'No Action Required',
    'REJECT_FROM_CHECKER': 'Reject From Checker',
    'CANCEL_FROM_CHECKER': 'Cancel From Checker',
    'NO_LONGER_USED': 'No Longer Used',
    'NEED_CHECKER_TO_AUTHORIZE': 'Need Checker To Authorize'
}

export const masterdbStatusMatrixMap = {
    'ACTIVE': 'Active',
    'INACTIVE': 'In Active'
}

export const paymentMethods = [
    {
        name: 'RTGS',
        title: 'RTGS',
        code: '180'
    },
    {
        name: 'SKN',
        title: 'SKN',
        code: '100'
    },
]

export const listBanks = [
    "BI RTGS",
    "BCA",
    "BNI",
    "Bank Mandiri",
    "Bank Bukopin",
    "Bank Danamon",
    "Bank Mega",
    "Bank CIMB Niaga",
    "Bank Permata",
    "Bank Sinarmas",
    "Bank QNB",
    "Bank Lippo",
    "Bank UOB",
    "Panin Bank",
    "Citibank",
    "Bank ANZ",
    "Bank Commonwealth",
    "Bank Maybank",
    "Bank Maspion",
    "Bank J Trust",
    "Bank QNB",
    "Bank KEB Hana",
    "Bank Artha Graha",
    "Bank OCBC NISP",
    "Bank MNC",
    "Bank DBS",
    "BRI",
    "BTN",
    "Bank DKI",
    "Bank BJB",
    "Bank BPD DIY",
    "Bank Jateng",
    "Bank Jatim",
    "Bank BPD Bali",
    "Bank Sumut",
    "Bank Nagari",
    "Bank Riau Kepri",
    "Bank Sumsel Babel",
    "Bank Lampung",
    "Bank Jambi",
    "Bank Kalbar",
    "Bank Kalteng",
    "Bank Kalsel",
    "Bank Kaltim",
    "Bank Sulsel",
    "Bank Sultra",
    "Bank BPD Sulteng",
    "Bank Sulut",
    "Bank NTB",
    "Bank NTT",
    "Bank Maluku",
    "Bank Papua",
]

export const settlementReportValidationStatuses = {
    "SUBMITTED_BY_MAKER": "Submitted by Maker",
    "REJECTED_FROM_CHECKER": "Rejected From Checker",
    "APPROVED": "Approved",
    "SUCCEED": "Succeed",
    "FAILED": "Failed",
    "NEW": "New" //pertama setelah generate
}

export const patternMethod = {
    'artajasa_bi_rtgs': {
        paymentMethods: ['RTGS'],
        settlementAmountTypes: ['NO_LIMIT']
    },
    'artajasa_bni': {
        paymentMethods: ['SKN', 'RTGS'],
        settlementAmountTypes: ['LESS_THAN_BIO', 'GREATER_THAN_BIO']
    },
    'artajasa_mandiri': {
        paymentMethods: ['SKN', 'RTGS'],
        settlementAmountTypes: ['LESS_THAN_BIO', 'GREATER_THAN_BIO']
    },
    'mitracomm_bca': {
        paymentMethods: ['SKN', 'RTGS'],
        settlementAmountTypes: ['LESS_THAN_BIO', 'GREATER_THAN_BIO']
    },
}