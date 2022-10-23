import notificationRoutes from 'appModule/push-notification/push-notification.routes'
import billpaymentRoutes from 'appModule/billpayment/billpayment.routes'
import ekycRoutes from 'appModule/ekyc/ekyc.routes'
import supportAdminRoutes from 'appModule/support-admin/support-admin.routes'
import pendingTasksRoutes from 'appModule/pending-tasks/pending-tasks.routes'
import reportRoutes from 'appModule/report/report.routes'
import agentsRoutes from 'appModule/agents/agents.routes'

const routes = [
    // Agents
    ...agentsRoutes,
    // EKYC
    ...ekycRoutes,
    // supportAdmin
    ...supportAdminRoutes,
    // pending task
    ...pendingTasksRoutes,
    // report
    ...reportRoutes,
    // BILL PAYMENT
    ...billpaymentRoutes,
    // NOTIFICATION
    ...notificationRoutes
]
export default routes
