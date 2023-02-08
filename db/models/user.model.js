const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const schema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      required: true,
      select: true
    },
    scope: {
      type: Number
    }
  }, { usePushEach: true }
)

// schema.index({ admin: 1, number: 1}, { unique: true });
schema.plugin(timestamps)

const user = mongoose.model('user', schema)

export default user
