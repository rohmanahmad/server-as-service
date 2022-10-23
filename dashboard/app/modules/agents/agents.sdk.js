import { Request } from 'services/SDK/main'

const R = new Request()

// AGENTS

export const LoginAgent = function (data) {
    return R.init().post('/api/v1.0/agent/login', data)
}

export const CreateAgenList = function (data) {
    return R.init().post('/api/v1.0/agent/create', data)
}

export const ValidateUserId = function (params) {
    return R.init().post('/api/v1.0/agent/validate', params)
}

export const LogoutAgent = function (data) {
    return R.init().get('/api/v1.0/agent/logout', data)
}

export const BlockAgenUser = function (data) {
    return R.init().post('/api/v1.0/agent/block', data)
}

export const UserAgenList = function (params) {
    return R.init().get('/api/v1.0/agent/list', params)
}

export const ChangeRoleAgent = function (data) {
    return R.init().post('/api/v1.0/agent/change', data)
}

export const UnBlockAgenUser = function (data) {
    return R.init().post('/api/v1.0/agent/unblock', data)
}

export const RemoveUserAgent = function (data) {
    return R.init().post('/api/v1.0/agent/remove', data)
}
// ACCESS
export const AccessSearch = function (params) {
    return R.init().get('/api/v1.0/access/search', params)
}
// ROLES
export const getListRole = function (params) {
    return R.init().get('/api/v1.0/roles/search', params)
}

export const  CreateRole = function (data) {
    return R.init().post('/api/v1.0/roles/create', data)
}

export const RemoveRole = function (params) {
    return R.init().get('/api/v1.0/roles/remove', params)
}

export const UpdateRole = function (params) {
    return R.init().post('/api/v1.0/roles/update', params)
}

// utilities
export const getListDomainExternals = function () {
    return R.init().get('/api/v1.0/utils/external-domains')
}