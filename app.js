const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')
const errorHandler = require('./tools/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.FULLURLHEAD = req.protocol + '://' + req.get('host') + req.originalUrl
  next()
})

app.use(routes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})