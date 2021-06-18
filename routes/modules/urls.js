const express = require('express')
const router = express.Router()

const Url = require('../../models/url')

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

router.get('/:shortUrl', async (req, res) => {
  const urlObj = await Url.findOne({ shortUrl: req.params.shortUrl })
  if (!urlObj) return res.sendStatus(404)
  return res.redirect(`${urlObj.fullUrl}`)
})

router.get('/', (req, res) => {
  return res.redirect('/')
})

router.post('/', async (req, res) => {
  try {
    //資料庫每筆資料的fullUrl與shortUrl不能重複
    //fullUrl重複的情況回傳已存在的shortUrl
    //shortUrl重複的情況重新導向/urls/retry/fullUrl路由，重新產生shortUrl
    const originalUrl = req.params.retryFullUrl || req.body.fullUrl
    const existsFullUrl = await Url.findOne({ fullUrl: originalUrl })
    if (existsFullUrl) {
      return res.render('show.hbs', { shortUrl: existsFullUrl.shortUrl })
    }
    const urlDocCreated = await Url.create({ fullUrl: originalUrl, shortUrl: '1GZB1' })
    return res.render('show.hbs', { shortUrl: urlDocCreated.shortUrl })
  } catch (err) {
    console.log('Something wrong when createing mongodb document for full url and short url in databse')
    return res.redirect(`/urls/retry/${req.body.fullUrl}`)
  }
})

module.exports = router