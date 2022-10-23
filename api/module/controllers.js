'use strict'

const fs = require('fs')
const path = require('path')

class Controller {
    async Home (req, res, next) {
        try {
            const indexTestHtml = fs.readFileSync(path.join('module/views/test.html'), {encoding: 'utf-8'})
            const indexTestModule = fs.readFileSync(path.join('module/views/module-test.js'), {encoding: 'utf-8'})
            const models = Object.keys(this.models).map(x => `<option value="${x}">${x}</option>`)
            const schemaTemplates = Object.keys(this.models)
                .map(x => {
                    const paths = this.models[x].schema.paths
                    const d = Object.keys(paths).map(o => [o, paths[o].instance]).reduce((r, x) => {
                        r[x[0]] = x[1]
                        return r
                    }, {})
                    return [x, d]
                })
                .reduce((r, x) => {
                    r[x[0]] = x[1]
                    return r
                }, {})
            const methods = (this.routes)
                .filter(x => x.path !== '/')
                .map(x => {
                    const method = x.path.replace('/model/:modelname/', '')
                    return `<option value="${'/model/:modelname/' + method}">${method}</option>`
                })
            const html = indexTestHtml
                .replace('{{module-test}}', indexTestModule)
                .replace('{{methods}}', methods)
                .replace('{{models}}', models)
                .replace('{{schemaTemplates}}', JSON.stringify(schemaTemplates))
            res.send(html)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async FindOne (req, res, next) {
        try {
            const criteria = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.findOne(criteria)
            res.send(data || {})
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async CreateOne (req, res, next) {
        try {
            const item = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.create(item)
            res.send(data)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async CreateMany (req, res, next) {
        try {
            const items = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.insertMany(items)
            res.send(data)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async DeleteOne (req, res, next) {
        try {
            const criteria = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.deleteOne(criteria)
            res.send(data)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async DeleteMany (req, res, next) {
        try {
            const criteria = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.deleteMany(criteria)
            res.send(data)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async UpdateOne (req, res, next) {
        try {
            const { $criteria, $update, $options } = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.updateOne($criteria, $update, $options)
            res.send(data)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async UpdateMany (req, res, next) {
        try {
            const { $criteria, $update } = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.updateMany($criteria, $update)
            res.send(data)
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async FindAll (req, res, next) {
        try {
            const {$criteria, $limit, $skip, $fields} = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.find($criteria, $fields).limit($limit).skip($skip)
            res.send(data || {})
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
    async Aggregate (req, res, next) {
        try {
            const aggregate = req.body
            const modelName = req.params.modelname
            const model = this.models[modelName]
            const data = await model.aggregate(aggregate)
            res.send(data || {})
        } catch(err) {
            res
                .status(500)
                .send({
                    error: err.message,
                    stack: err.stack
                })
        }
    }
}

module.exports = function (controllerName, properties={}) {
    return new Controller()[controllerName].bind(properties)
}