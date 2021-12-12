const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
  _forUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'code must be for user']
  },
  activated: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    required: [true, 'code must give points'],
    validate: {
      validator: function(el){
        return el > 0
      },
      message: "Code can't give negative points"
    }
  },
  orgName: {
    type: String,
    required: [true]
  }
})


const Code = mongoose.model('Code', codeSchema)

module.exports = Code
