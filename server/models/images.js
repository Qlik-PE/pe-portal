var mongoose = require("mongoose"),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var ImageSchema = new Schema({
  entityid: Schema.ObjectId,
  mimetype: String,
  filename: String,
  content: Buffer,
  createuser: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("image", ImageSchema);
