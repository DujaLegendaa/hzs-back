const factory = require('./handlerFactory')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const mongoose = require('mongoose')

exports.getUser = factory.getOne(User)

const ids = [
  "61b5ac61399b0124b731c4aa",
  "61b5ac84399b0124b731c4ac",
  "61b5acb6399b0124b731c4ae"
]

exports.getCompanies = catchAsync(async (req, res, next) => {
  const sbb = await User.findById(ids[0])
  const gigatron = await User.findById(ids[1])
  const technomedia = await User.findById(ids[2])

  res.status(200).json({
    status: 'success',
    data: {
      sbb: sbb.organizedEvents.length, 
      gigatron: gigatron.organizedEvents.length, 
      technomedia: technomedia.organizedEvents.length
    }
  })
})