const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const User = require('./../models/userModel')
const util = require('util')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ), //to milisecs
    httpOnly: false, //aaaaa
  }
  if (process.env.NODE_ENV == 'production') cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions)

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  })
}

module.exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const newUser = await User.create({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    city: req.body.city,
    organizationName: req.body.organizationName
  })

  createSendToken(newUser, 201, res)
})

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400))

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password)))
    return next(new AppError('Incorrect email or password', 400))

  createSendToken(user, 200, res)
})

module.exports.protect = catchAsync(async (req, res, next) => {
  let token = undefined
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1]

  if (!token)
    return next(
      new AppError(
        'You are not logged in. Please log in to access this route.',
        401,
      ),
    )

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  )

  const user = await User.findById(decoded.id)
  if (!user)
    return next(new AppError('The user with this token does not exist', 401))

  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password. Please log in again.', 401),
    )

  req.user = user
  next()
})

module.exports.restrictToRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to access this route'),
      )

    next()
  }
}

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = User.findOne({ email: req.body.email })
  if (!user)
    return next(new AppError('There is no user with this email address', 404))

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
})
