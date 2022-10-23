import { Request } from 'services/SDK/main'

const R = new Request()

export const pushNotifList = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/pushnotif/master/list', payload)
}
export const pushNotifCreate = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/pushnotif/master/create', payload)
}
export const pushNotifUploadTargetUser = function (payload={}, opt={}) {
    return R.init().upload('/api/v1.0/pushnotif/master/target-users/upload', payload, opt)
}
export const pushNotifUpdateTargetUser = function (payload={}, opt={}) {
    return R.init().upload('/api/v1.0/pushnotif/master/target-users/update', payload, opt)
}
export const pushNotifCode = function (payload={}, opt={}) {
    return R.init().get('/api/v1.0/pushnotif/code/list', payload)
}
export const getFCMTokens = function (payload) {
    return R.init().get('/api/v1.0/pushnotif/fcm-token/list', payload)
}
export const createFCMToken = function (payload) {
    return R.init().post('/api/v1.0/pushnotif/fcm-token/create', payload)
}
export const deleteFCMToken = function (payload) {
    return R.init().get('/api/v1.0/pushnotif/fcm-token/delete', payload)
}
export const getPushNotifComments = function (payload) {
    return R.init().get('/api/v1.0/pushnotif/comments/list', payload)
}
export const createPushNotifComments = function (payload) {
    return R.init().post('/api/v1.0/pushnotif/comments/create', payload)
}
export const pushNotifUploadCommentAttachment = function (payload={}, opt={'Content-Type': 'multipart/form-data'}) {
    return R.init().upload('/api/v1.0/pushnotif/comments/upload-image', payload)
}
export const getDestinationPages = function (payload={}) {
    return R.init().get('/api/v1.0/pushnotif/master/destination-pages', payload)
}
export const sendTestMessage = function (payload={}) {
    return R.init().post('/api/v1.0/pushnotif/master/send-test', payload)
}
export const pushNotifGetChangesMaster = function (payload={}) {
    return R.init().get('/api/v1.0/pushnotif/pending-approval/master-changes', payload)
}
export const pushNotifUploadImage = function (payload={}, opt={}) {
    return R.init().upload('/api/v1.0/pushnotif/upload-image', payload, {'Content-Type': 'multipart/form-data', ...opt})
}
export const updateNotification = function (masterId, payload) {
    return R.init().post('/api/v1.0/pushnotif/master/update-changes/' + masterId, payload)
}
export const approveRejectNotification = function (masterId, payload) {
    return R.init().post('/api/v1.0/pushnotif/master/approve-reject/' + masterId, payload)
}
export const createNotif = function (payload) {
    return R.init().post('/api/v1.0/pushnotif/master/create-notif', payload)
}
export const submitForApproval = function (payload) {
    return R.init().post('/api/v1.0/pushnotif/master/submit-for-approval-notif', payload)
}
export const deactivateNotif = function (masterId, payload) {
    return R.init().post('/api/v1.0/pushnotif/master/deactivate/' + masterId, payload)
}
export const pushNotifSchedule = function (payload) {
    return R.init().get('/api/v1.0/pushnotif/master/schedule', payload)
}
export const pushNotifUploadConfig = function (payload) {
    return R.init().get('/api/v1.0/pushnotif/get-upload-config', payload)
}
export const pushNotifGetTargetUserStatus = function (payload) {
    return R.init().get('/api/v1.0/pushnotif/get-target-user-status', payload)
}