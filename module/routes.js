'use strict'

let routes = []

routes.push({
    path: '/',
    method: 'GET',
    controller: 'Home',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/find-one',
    method: 'POST',
    controller: 'FindOne',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/create-one',
    method: 'POST',
    controller: 'CreateOne',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/create-many',
    method: 'POST',
    controller: 'CreateMany',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/delete-one',
    method: 'POST',
    controller: 'DeleteOne',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/delete-many',
    method: 'POST',
    controller: 'DeleteMany',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/update-one',
    method: 'POST',
    controller: 'UpdateOne',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/update-many',
    method: 'POST',
    controller: 'UpdateMany',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/find-all',
    method: 'POST',
    controller: 'FindAll',
    middlewares: []
})

routes.push({
    path: '/model/:modelname/aggregate',
    method: 'POST',
    controller: 'Aggregate',
    middlewares: []
})

module.exports = routes