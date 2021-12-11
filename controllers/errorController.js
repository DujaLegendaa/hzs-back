const AppError = require('./../utils/appError')

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV == 'development') {
    let error = { ...err }

    if (error.code === 11000) err = handleDuplicateFieldsDB(err)
    res = sendErrorDev(err, res)
  }
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const handleDuplicateFieldsDB = (error) => {
  let keyVal = JSON.stringify(error).split(',')[3]
  keyVal = keyVal.substring(12, keyVal.length - 1).split(':')
  const field = keyVal[0].substring(1, keyVal[0].length - 1)
  const value = keyVal[1].substring(1, keyVal[1].length - 1)
  error.message = `Enitity with ${field} : ${value} already exists. Please use something else.`
  return error
}
