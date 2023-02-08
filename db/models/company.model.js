const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const schema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId
    },
    companyName: {
      type: String
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    contractStartDate: {
      type: String
    },
    totalCostOfCompany: {
      type: Number
    }
  }, { usePushEach: true }
)

// schema.index({ admin: 1, number: 1}, { unique: true });
schema.plugin(timestamps)

const user = mongoose.model('company', schema)

export default user
