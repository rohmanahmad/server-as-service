'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

class Server {
    constructor({ host, port, serverKey, mongodsn }) {
        this.host = host
        this.port = port
        this.serverKey = serverKey
        this.mongodsn = mongodsn
    }
    init ({ routes, controllers, properties={} }) {
        this.connectDB()
        for (const r of routes) {
            console.log('Register Route:', `[${r.method}] ${r.path} {${r.controller}}`)
            if (r.method == 'GET') app.get(r.path, controllers(r.controller, properties))
            if (r.method == 'POST') app.post(r.path, controllers(r.controller, properties))
        }
        return this
    }
    start () {
        app.listen(parseInt(this.port), () => {
            console.log('Server Listen', `${this.host}:${this.port}`)
        })
    }
    // activity db
    connectDB() {
        mongoose.connection.on('error', err => {
            console.error(err)
        })
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected')
        })
        mongoose.connect(this.mongodsn, {})
    }
}

require('dotenv').config({})
const host = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_PORT || 3000
const serverKey = process.env.SERVER_KEY
const mongodsn = process.env.MONGO_DSN

const routes = require('./module/routes')
const controllers = require('./module/controllers')

const user = require('./module/models/User')
const products = require('./module/models/Products')
const test = require('./module/models/Test')
const models = { user, products, test }

new Server({ host, port, serverKey, mongodsn }).init({ routes, controllers, properties: { models, routes } }).start()