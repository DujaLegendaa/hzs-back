const factory = require('./handlerFactory')
const Code = require('./../models/codeModel')
const crypto = require('crypto')
const AppError = require('../utils/appError')
const User = require('./../models/userModel')
const Event = require('./../models/eventModel')
const ApiFeatures = require('./../utils/apiFeatures')

exports.generateOne = catchAsync(async (req, res, next) => {
  const newDoc = await Code.create({
    _forUser: req.body._forUser,
    points: req.body.points
  })

  res.status(201).json({
    status: 'success',
    data: { newDoc },
  })
}) 

exports.generateForEvent = catchAsync(async (req, res, next) => {
  const ev = await Event.findById(req.params.id)
  let codeList = []
  let cList = []
  if(!ev)
    return next(new AppError(`No event with id ${req.params.id}`, 404))
  if(ev.date >= Date.now())
    return next(new AppError('You can only generate codes after the event starts', 400))
  for(const el of ev.participants){
      const newCode = await Code.create({_forUser: el, points: ev.pointsPerParticipant})
      cList.push(newCode)
      codeList.push(newCode._id)
    }
  ev.codes = codeList
  ev.save()
  res.status(201).json({
    status: 'success',
    data: { doc: cList }
  })
})

exports.consume = catchAsync(async (req, res, next) => {
  const doc = await Code.findById(req.params.id)
  if (!doc)
      return next(
        new AppError(`Nije pronadjen dokument sa id ${req.params.id}`, 404),
      )
  if(!doc._forUser.equals(req.user._id))
    return next(new AppError('Kod nije za ovog korisnika', 400))

  if(doc.activated)
    return next(new AppError('Kod je već aktiviran', 400))

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

exports.forUser = catchAsync(async (req, res, next) => {
  const doc = await Code.findById(req.params.id).select("_forUser").populate("_forUser")
  if (!doc)
      return next(
        new AppError(`No document found with id ${req.params.id}`, 404),
      )

  res.status(201).json({
    status: 'success',
    data: { doc },
  })
})