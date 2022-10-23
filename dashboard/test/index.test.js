const { config } = require('./config')
const login = require('./testing/login')
const customerBl = require('./testing/customers-block')
const customerUnBl = require('./testing/customer-unblock')
const customesView = require('./testing/customer-view')
const PendingTaskApprove = require('./testing/pending-task-approve')
const PendingTaskReject = require('./testing/pending-task-reject')
const UserAccessList = require('./testing/user-access-list')
const UserAccessChange = require('./testing/change-user-access')
const UserAccessBlock = require('./testing/block-user-access')
const UserAccessUnBlock = require('./testing/unblock-user-access')
const UserAccessDelete = require('./testing/delete-user-access')
const UserAccessCreate = require('./testing/create-user-access')
const RoleCreate = require('./testing/create-role')
const RoleEdit = require('./testing/edit-role')
const RoleList = require('./testing/role-list')
class App {
    constructor () {}
    async start(){
        login.Logins(config['agent.login'])
        // customerBl.Block(config['customers.block'])
        // customesView.View(config['customers.view'])
        // customerUnBl.UnBlock(config['customers.block'])
        // PendingTaskApprove.Approve(config['pending.task'])
        // PendingTaskReject.Reject(config['pending.task'])
        // UserAccessList.List(config['user.access'])
        // UserAccessChange.Change(config['user.access'])
        // UserAccessBlock.Block(config['user.access'])
        // UserAccessUnBlock.UnBlock(config['user.access'])
        UserAccessDelete.Delete(config['user.access'])
        // UserAccessCreate.Create(config['user.create'])
        // RoleList.List(config['role.list'])
        // RoleCreate.Create(config['role.create'])
        // RoleEdit.Edit(config['role.edit'])
    }
}

new App().start()