import { Request } from 'appsdk'

const R = new Request()

export const collectionRead = function (collectionName, payload={}) {
    return R.init().get('/api/v1.0/support/administration/collection/read/' + collectionName, payload)
}
export const collectionWrite = function (collectionName, payload={}) {
    return R.init().post('/api/v1.0/support/administration/collection/write/' + collectionName, payload)
}
export const collectionReset = function (collectionName, payload={}) {
    return R.init().get('/api/v1.0/support/administration/collection/reset/' + collectionName, payload)
}
export const checkup = function () {
    return R.init().get('/api/v1.0/checkup/all')
}
export const versionInfo = function () {
    return R.init().get('/')
}