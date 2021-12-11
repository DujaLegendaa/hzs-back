
const factory = require('./handlerFactory')
const Event = require('./../models/eventModel')
const User = require('./../models/userModel')

exports.setCreator = (req, res, next) => {
  req.body._creator = req.user._id
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
    return next(new AppError(`No document found with id ${req.params.id}`, 404))

  if (!doc._creator.equals(req.user._id))
    return next(
      new AppError("You don't have permission to update this event", 401),
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

  if (!doc) return next(new AppError('No document found with id ' + id, 404))

  if (!doc._creator.equals(req.user._id))
    return next(
      new AppError("You don't have permission to delete this recipe", 401),
    )

  await Event.findByIdAndDelete(req.params.id)

  res.status(200).json({
    status: 'success',
    data: null,
  })
})