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
  numParticipants: {
    type: Number,
    required: [true, 'number of participants not provided']
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  //point for user
  description: {
    type: String,
    required: [true, 'description not provided']
  }
})


const Event = mongoose.model('Event', eventSchema)

module.exports = Event
