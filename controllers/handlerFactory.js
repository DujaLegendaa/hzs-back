const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const ApiFeatures = require('./../utils/apiFeatures')

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const features = new ApiFeatures(Model.find(), req.query)
    features.filter()
    const docs = await features.query

    res.status(200).json({
      status: 'success',
      data: { docs },
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body)
    res.status(201).json({
      status: 'success',
      data: { newDoc },
    })
  })

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id)

    if (!doc)
      return next(
        new AppError(`Nije pronadjen ni jedan dokument sa id ${req.params.id}`, 404),
      )

    res.status(200).json({
      status: 'success',
      data: { doc },
    })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedDoc)
      return next(
        new AppError(`Nije pronadjen ni jedan dokument sa id ${req.params.id}`, 404),
      )

    res.status(200).json({
      status: 'success',
      data: { updatedDoc },
    })
  })

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) return next(new AppError('Nije pronadjen ni jedan dokument sa id ' + id, 404))

    res.status(200).json({
      status: 'success',
      data: null,
    })
  })
