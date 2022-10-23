import { Request } from 'services/SDK/main'

const R = new Request()

export const snapshotStatus = function (payload={}) {
    return R.init().get('/api/v1.0/snapshot/status', payload)
}
export const snapshotStart = function (payload={}) {
    return R.init().get('/api/v1.0/snapshot/start', payload)
}
export const snapshotStop = function (payload={}) {
    return R.init().get('/api/v1.0/snapshot/stop', payload)
}
export const snapshotList = function (payload={}) {
    return R.init().get('/api/v1.0/snapshot/list', payload)
}
export const snapshotDownload = function (payload={}) {
    const opt = {responseType: 'blob'}
    return R.init().get('/api/v1.0/snapshot/download', payload, opt)
}
export const snapshotReset = function (payload={}) {
    return R.init().get('/api/v1.0/snapshot/reset', payload)
}