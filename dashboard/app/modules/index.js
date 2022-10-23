
import reportModules from './report/report.index'
import agentsModules from './agents/agents.index'
import supportAdminModules from './support-admin/support-admin.index'
import pendingTasksModules from './pending-tasks/pending-tasks.index'
import ekycModules from './ekyc/ekyc.index'
import pushNotificationModules from './push-notification/push-notification.index'
import billpaymentModules from './billpayment/billpayment.index'

const moduleObject = {
    ...reportModules,
    ...agentsModules,
    ...supportAdminModules,
    ...pendingTasksModules,
    ...ekycModules,
    ...billpaymentModules,
    ...pushNotificationModules,
}

export default function appModule(name) {
	return moduleObject[name]
}