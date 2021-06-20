const ApiErrors = require('./apiErrors')

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiErrors) {
    return res.status(err.code).jsonp([{ code: err.code, message: err.msg }])
  }
  return res.status(500).jsonp([{ code: 500, message: 'Something went wrong' }])
}

module.exports = errorHandler