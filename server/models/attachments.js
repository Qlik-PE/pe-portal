var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var AttachmentSchema = new Schema({
  entityId: Schema.ObjectId,
  mimetype: String,
  filename: String,
  image: String,
  thumbnail: String,
  width: Number,
  height: Number,
  createuser: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("attachment", AttachmentSchema);
