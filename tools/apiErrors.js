function ApiErrors(code, msg) {
  this.code = code
  this.msg = msg
  this.incomingRequest = function (msg) {
    return new ApiErrors(400, msg)
  }
  this.internalHandling = function (msg) {
    return new ApiErrors(500, msg)
  }
}
module.exports = ApiErrors