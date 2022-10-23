import { Request } from 'services/SDK/main'

const R = new Request()

export const createAgentActivity = function (payload={}, opt={}) {
    return R.init().post('/api/v1.0/logs/activity/agent', payload, opt)
}