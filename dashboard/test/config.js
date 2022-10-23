const {join} = require('path')

const host = 'http://localhost:3000/#'

module.exports = {
    host,
    config : {
        'agent.login': {
           url: join(host, '/login')
        },
        'customers.block': {
            url: join(host, '/customers')
        },
        'customers.view': {
            url: join(host, '/customers/view?userid=abdulrohman123')
        },
        'pending.task': {
            url: join(host, '/task/pendings')
        },
        'user.access': {
            url: join(host, '/user/access')
        },
        'user.create': {
            url: join(host, '/user/create')
        },
        'role.list': {
            url: join(host, '/role/list')
        },
        'role.edit': {
            url: join(host, '/role/edit')
        },
        'role.create': {
            url: join(host, '/role/create')
        }
    }
}