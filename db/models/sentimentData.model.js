const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const schema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sentimentalData",
    },
    contentId: {
      type: String,
    },
    sentimentSummary: {
      type: String,
    },
    sentimentScore: {
      type: String,
    },
  },
  { usePushEach: true }
);

// schema.index({ admin: 1, number: 1}, { unique: true });
schema.plugin(timestamps);

const sentimentData = mongoose.model("sentimentData", schema);

export default sentimentData;
