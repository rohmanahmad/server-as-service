'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const testSchema = new Schema({
    a: String,
    b: String,
    c: String,
    d: Number,
})

module.exports = model('Test', testSchema)