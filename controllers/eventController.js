
const factory = require('./handlerFactory')
const Event = require('./../models/eventModel')
const User = require('./../models/userModel')
const AppError = require('../utils/appError')

exports.setCreator = (req, res, next) => {
  req.body._creator = req.user._id
  req.body.orgName = req.user.organizationName
  next()
}

exports.getAllEvents= factory.getAll(Event)

exports.getEvent = factory.getOne(Event)

exports.createEvent = catchAsync(async (req, res, next) => {
  const newDoc = await Event.create(req.body)

  const user = await User.findById(req.user._id)
  user.organizedEvents.push(newDoc._id)

  console.log(req.body)

  user.save({ validateBeforeSave: false })
  res.status(201).json({
    status: 'success',
    data: { newDoc },
  })
})

exports.updateEvent = catchAsync(async (req, res, next) => {
  const doc = await Event.findById(req.params.id)

  if (!doc)
    return next(new AppError(`Nije pronadjen ni jedan dokument sa id ${req.params.id}`, 404))

  if (!doc._creator.equals(req.user._id))
    return next(
      new AppError("Nemate dozvolu da izmenite ovaj dogadjaj.", 401),
    )

  const updatedDoc = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: { updatedDoc },
  })
})

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const doc = await Event.findById(req.params.id)

  if (!doc) return next(new AppError('Nije pronadjen ni jedan dokument sa id ' + id, 404))

  if (!doc._creator.equals(req.user._id))
    return next(
      new AppError("Nemate dozvolu da obrišete ovaj dogadjaj.", 401),
    )

  await Event.findByIdAndDelete(req.params.id)

  res.status(200).json({
    status: 'success',
    data: null,
  })
})

exports.isCreator = catchAsync(async (req, res, next) => {
  const doc = await Event.findById(req.params.id)

  if (!doc)
    return next(new AppError(`Nije pronadjen ni jedan dokument sa id ${req.params.id}`, 404))

  res.status(200).json({
    status: 'success',
    data: { isCreator: doc._creator.equals(req.user._id) },
  })
})

exports.join = catchAsync(async (req, res, next) => {
  const ev = await Event.findById(req.params.id)

  if (!ev)
    return next(new AppError(`Nije pronadjen ni jedan dokument sa id ${req.params.id}`, 404))

  const user = await User.findById(req.user._id)
  if(user.joinedEvents.includes(ev._id))
    return next(new AppError('Korisnik je već prijavljen za ovaj dogadjaj.', 400))

  user.joinedEvents.push(ev._id)
  ev.participants.push(user._id)

  user.save({validateBeforeSave: false})
  ev.save()

  res.status(200).json({
    status: 'success',
    data: { doc: ev},
  })
})

exports.isParticipating = catchAsync(async (req, res, next) => {
  const ev = await Event.findById(req.params.id)

  if (!ev)
    return next(new AppError(`No document found with id ${req.params.id}`, 404))

  res.status(200).json({
    status: 'success',
    data: { isParticipating: ev.participants.includes(req.user._id)},
  })
})

exports.leave = catchAsync(async (req, res, next) => {
  let ev = await Event.findById(req.params.id)

  if (!ev)
    return next(new AppError(`Nije pronadjen ni jedan dokument sa id ${req.params.id}`, 404))

  const user = await User.findById(req.user._id)
  if(!user.joinedEvents.includes(ev._id))
    return next(new AppError('Korisnik nije prijavljen ya ovaj dogadjaj.', 400))

  await User.findByIdAndUpdate(req.user._id, {
    $pullAll: { joinedEvents: [req.params.id] },
  })
  await Event.findByIdAndUpdate(req.params.id, {
    $pullAll: { participants: [req.user._id] },
  })
  
  ev = await Event.findById(req.params.id)
  ev.save()

  res.status(200).json({
    status: 'success',
    data: null,
  })
})