const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'creator not provided']
  },
  city: {
    type: String,
    required: [true, "city not provided"]
  },
  date: {
    type: Date,
    required: [true, 'date not provided']
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  numParticipants: {
    type: Number
  },
  //point for user
  description: {
    type: String,
    required: [true, 'description not provided']
  },
  orgName: {
    type: String,
    required: [true, 'orgName not provided']
  },
  codes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Code'
  },
  pointsPerParticipant: {
    type: Number,
    required: [true, 'points must be given']
  }
})

eventSchema.pre('validate', async function (next) {
  this.numParticipants = this.participants.length

  next()
})


const Event = mongoose.model('Event', eventSchema)

module.exports = Event
