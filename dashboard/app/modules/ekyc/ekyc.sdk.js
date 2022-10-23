import { Request } from 'services/SDK/main'

const R = new Request()

export const GetThresholdParameters = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/parameterization/business-parameter', payload, opt)
}

export const AddPendingThresholdParameters = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/ekyc/parameterization/business-parameter/add-pending', payload, opt)
}

export const FaceComparisonInquiry = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/face-comparison/inquiry/list', payload, opt)
}

export const FaceComparisonInquiryDownloadURL = function (payload={}, opt={}) {
    return {
            url: process.env.MIX_PROXY_URL_BASE + '/api/v1.0/ekyc/face-comparison/inquiry/download?' + serialize(payload),
            token: 'Bearer' + getCookie('token')
    }
}

export const FaceComparisonInquiryDetail = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/face-comparison/inquiry/detail/', payload, opt)
}

export const FaceComparisonInquirySync = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/face-comparison/inquiry/sync', payload, opt)
} 

export const FaceComparisonInquiryFilters = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/face-comparison/inquiry/filters', payload, opt)
} 

export const FaceComparisonAdHocCheckQuota = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/face-comparison/adhoc/quota', payload, opt)
}

export const FaceComparisonAdHocValidate = function (body={}, opt={}) {
    return R.init().post('/api/v1.0/ekyc/face-comparison/adhoc/validate', body, opt)
}

export const FaceComparisonInquiryDownload = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/ekyc/face-comparison/inquiry/download', payload, opt)
}

export const FaceComparisonInquiryDetailDownload = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/ekyc/face-comparison/inquiry/detail/download', payload, opt)
}

export const ComMoOnBoardingList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/list', payload, opt)
}

export const ComMoOnBoardingSync = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/sync', payload, opt)
}

export const ComMoOnBoardingFilters = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/filters', payload, opt)
}

export const ComMoOnBoardingDownload = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/ekyc/onboarding/download', payload, opt)
}

export const ComMoOnBoardingDetail = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/detail', payload, opt)
}

export const ComMoOnBoardingSubmitReviewFraud = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/ekyc/onboarding/review/fraud/submit', payload, opt)
}

export const ComMoOnBoardingSubmitReviewVc = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/ekyc/onboarding/review/vc/submit', payload, opt)
}

export const ComMoOnBoardingReview = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/review/list', payload, opt)
}

export const ComMoOnBoardingReviewSync = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/review/sync', payload, opt)
}

export const ComMoOnBoardingReviewFilters = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/ekyc/onboarding/review/filters', payload, opt)
}

export const ComMoOnBoardingDownloadReview = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/ekyc/onboarding/review/list/download', payload, opt)
}

export const ComMoOnBoardingDownloadDetail = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/ekyc/onboarding/detail/download', payload, opt)
}

export const ReportDownload = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get('/api/v1.0/' + opt.task_activity_type + '/activity/download', payload, opt)
}

export const DownloadAgentActivitiesData = function (payload={}, opt={}) {
    if (!payload.filename) opt['responseType'] = 'blob'
    return R.init().get("/api/v1.0/customers/parameterization-fc-log-activity", payload, opt)
}