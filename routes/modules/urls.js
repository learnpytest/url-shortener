const express = require('express')
const router = express.Router()

const Url = require('../../models/url')

const { check, validationResult } = require('express-validator')

const ApiErrors = require('../../tools/apiErrors') // error handling

let setClock = 5
let tries = 0

//如果短網址重複需要重新產生短網址
//重新導向短網址頁面/urls/:shortUrl顯示新產生的短網址
//在/urls/:shortUrl路由做錯誤處理，處理當使用者在/retry 路由下傳送不開放的API請求的情形
router.get('/retry/:retryFullUrl', async (req, res, next) => {
  if (tries > setClock) {
    console.log('setClock, too many tries')
    return next(new ApiErrors().incomingRequest('Too many requests error')) //error handling by errorHandler.js
  }

  const originalUrl = req.params.retryFullUrl
  try {
    const urlDocCreated = await Url.create({ fullUrl: originalUrl })
    req.params.retryShortUrl = urlDocCreated.shortUrl
    res.redirect('/urls/:shortUrl')
    return tries = 0
  } catch (err) {
    console.log('Something wrong when createing mongodb document for saving full url and short url')
    return res.redirect(`/urls/retry/${originalUrl}`)
  } finally {
    tries++
  }
})
//如果短網址重複需要重新產生短網址

//重新導向短網址所對應的網站
//客戶端只能取得授權的資料，無效的API request應該回傳錯誤的response
router.get('/:shortUrl', async (req, res, next) => {
  const shortUrl = req.params.retryShortUrl || req.params.shortUrl
  const urlObj = await Url.findOne({ shortUrl })
  if (!urlObj) {
    return next(new ApiErrors().incomingRequest('url not found')) //error handling by errorHandler.js
  }
  res.redirect(`${urlObj.fullUrl}`)
})
//重新導向短網址所對應的網站

router.get('/', (req, res) => {
  return res.redirect('/')
})

//從客戶端傳來完整網址
router.post('/', [check('fullUrl', 'Please enter complete URL, ex: http://www.google.com').trim().isURL({ protocols: ['http', 'https'], require_protocol: true })], async (req, res) => {
  //從客戶端傳來的網址必須是合法完整的HTTP,HTTPS網址
  //應該給予使用者網址格式的建議與提式
  //驗證
  const errors = await validationResult(req)
  if (!errors.isEmpty()) {
    [errorArray, wrong] = [errors.array(), true]
    return res.render('index', { errorArray, wrong })
  }
  //驗證

  try {
    //資料庫每筆資料的fullUrl與shortUrl不能重複
    //fullUrl重複的情況不會再產生對應的shortUrl，直接回傳已存在的shortUrl
    //shortUrl重複的情況重新導向/urls/retry/:retryFullUrl路由，直接重新產生不重複的shortUrl，讓使用者有比較好的使用體驗
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