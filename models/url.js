const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tinyIdGenerator = require('../tools/tinyIdGenerator')

const urlSchema = new Schema({
  fullUrl: {
    type: String,
    required: true,
    unique: true
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    default: tinyIdGenerator
  }
})

module.exports = mongoose.model('Url', urlSchema)