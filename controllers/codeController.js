const factory = require('./handlerFactory')
const Code = require('./../models/codeModel')
const crypto = require('crypto')
const AppError = require('../utils/appError')
const User = require('./../models/userModel')

exports.generateOne = catchAsync(async (req, res, next) => {
  const newDoc = await Code.create({
    _forUser: req.body._forUser,
    value: crypto.randomBytes(16).toString('hex'),
    points: req.body.points
  })

  res.status(201).json({
    status: 'success',
    data: { newDoc },
  })
}) 

exports.consume = catchAsync(async (req, res, next) => {
  const doc = await Code.findById(req.params.id)
  if (!doc)
      return next(
        new AppError(`No document found with id ${req.params.id}`, 404),
      )
  if(!doc._forUser.equals(req.user._id))
    return next(new AppError('Code is not for this user', 400))

  if(doc.activated)
    return next(new AppError('Code is already activated', 400))

  doc.activated = true
  const user = await User.findById(req.user._id)
  user.points += doc.points

  doc.save()
  user.save({validateBeforeSave: false})

  res.status(201).json({
    status: 'success',
    data: { doc: user },
  })
})