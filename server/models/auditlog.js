var mongoose = require("mongoose"),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var AuditLogSchema = new Schema({
  entity: String,
  user: Schema.ObjectId
  date: Date,
  oldValue: String,
  newValue: String,
  createuser: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("auditlog", ImageSchema);
