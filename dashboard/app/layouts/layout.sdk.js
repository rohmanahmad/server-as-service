import { Request } from 'appsdk'

const R = new Request()

export const getListMenu = function (params) {
    return R.init().get('/api/v1.0/behavour/menu', params)
}