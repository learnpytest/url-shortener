const express = require('express')
const router = express.Router()

const Url = require('../../models/url')

const { check, validationResult } = require('express-validator')

//如果短網址重複需要重新產生短網址
router.get('/retry/:retryFullUrl', async (req, res) => {
  const originalUrl = req.params.retryFullUrl
  try {
    const urlDocCreated = await Url.create({ fullUrl: originalUrl })
    return res.render('show.hbs', { shortUrl: urlDocCreated.shortUrl })
  } catch (err) {
    console.log('Something wrong when createing mongodb document for saving full url and short url')
    return res.redirect(`/urls/retry/${originalUrl}`)
  }
})
//如果短網址重複需要重新產生短網址

//重新導向短網址所對應的網站
router.get('/:shortUrl', async (req, res) => {
  const urlObj = await Url.findOne({ shortUrl: req.params.shortUrl })
  if (!urlObj) return res.sendStatus(404)
  return res.redirect(`${urlObj.fullUrl}`)
})
//重新導向短網址所對應的網站

router.get('/', (req, res) => {
  return res.redirect('/')
})

//從客戶端傳來完整網址
router.post('/', [check('fullUrl', 'Please enter complete URL, ex: http://www.google.com').trim().isURL({ protocols: ['http', 'https'], require_protocol: true })], async (req, res) => {
  //從客戶端傳來的網址必須是合法完整的HTTP,HTTPS網址
  //驗證
  const errors = await validationResult(req)
  if (!errors.isEmpty()) {
    errorArray = errors.array()
    wrong = true
    return res.render('index', { errorArray, wrong })
  }
  //驗證

  try {
    //資料庫每筆資料的fullUrl與shortUrl不能重複
    //fullUrl重複的情況回傳已存在的shortUrl
    //shortUrl重複的情況重新導向/urls/retry/fullUrl路由，重新產生shortUrl
    const originalUrl = req.params.retryFullUrl || req.body.fullUrl
    const existsFullUrl = await Url.findOne({ fullUrl: originalUrl })
    if (existsFullUrl) {
      return res.render('show.hbs', { shortUrl: existsFullUrl.shortUrl })
    }
    const urlDocCreated = await Url.create({ fullUrl: originalUrl })
    return res.render('show.hbs', { shortUrl: urlDocCreated.shortUrl })
  } catch (err) {
    console.log('Something wrong when createing mongodb document for full url and short url in databse')
    return res.redirect(`/urls/retry/${req.body.fullUrl}`)
  }
})

module.exports = router