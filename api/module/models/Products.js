'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const productSchema = new Schema({
    productId: String,
    name: String,
    sku: String,
    price: Number,
    status: Number,
})

productSchema.index({ productId: 1 })
productSchema.index({ sku: 1 })

module.exports = model('Products', productSchema)