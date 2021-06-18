const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const urls = require('./modules/urls')

const ApiErrors = require('../tools/apiErrors')

router.use('/urls', urls)
router.use('/', home)

router.use((req, res, next) => {
  next(new ApiErrors().incomingRequest('Page Not Found'))
})

module.exports = router