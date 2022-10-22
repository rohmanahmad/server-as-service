'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    status: Number,
})

userSchema.index({ username: 1 })
userSchema.index({ email: 1 })

module.exports = model('User', userSchema)