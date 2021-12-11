const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
  _forUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'code must be for user']
  },
  value: {
    type: String,
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
  }
})


const Code = mongoose.model('Code', codeSchema)

module.exports = Code
