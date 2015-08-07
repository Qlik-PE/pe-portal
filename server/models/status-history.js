var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var StatusHistorySchema = new Schema({
  entityId: Schema.ObjectId,
  createuser: {
    type: Schema.ObjectId,
    ref: "user"
  },
  createdate: {
    type: Date,
    default: Date.now
  },
  oldStatus: String,
  newStatus: String
});

module.exports = mongoose.model("statushistory", StatusHistorySchema);
