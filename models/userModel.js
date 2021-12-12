const mongoose = require('mongoose')
const bcrpyt = require('bcrypt')
const validator = require('validator')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name not provided'],

  },
  surname: {
    type: String,
    required: [true, 'surname not provided'],

  },
  email: {
    type: String,
    required: [true, 'email not passed'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'password not provided'],
    select: process.env.NODE_ENV == 'development' ? true : false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'password confirm not provided'],
    validate: {
      validator: function (el) {
        return this.password === el
      },
      message: 'passwords do not match',
    },
  },
  role: {
    type: String,
    enum: ['organizator', 'user'],
    required: [true, 'role not provided'],
    default: 'user',
  },
  city: {
    type: String,
    required: [true, 'city not provided']
  },
  organizationName: {
    type: String,
    default: undefined,
    unique: true
  },
  organizedEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Event'
  },
  joinedEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Event'
  },
  points: {
    type: Number,
    default: 0
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()

  this.password = await bcrpyt.hash(this.password, 12)

  this.passwordConfirm = undefined

  if(this.role != 'organizator' && this.organizationName != undefined)
    this.organizationName = undefined

  next()
})

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrpyt.compare(candidatePassword, this.password)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    )

    return JWTTimestamp < changedTimestamp
  }
  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
