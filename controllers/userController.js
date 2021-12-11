const factory = require('./handlerFactory')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getUser = factory.getOne(User)