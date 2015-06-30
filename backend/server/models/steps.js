var mongoose = require("mongoose"),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var ValidationstepSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: Schema.ObjectId,
    ref: "steptype",
    required: false
  },
  validationid: {
    type: Schema.ObjectId,
    ref: "validation",
    required: false
  },
  techtypeId:{
    type: Schema.ObjectId,
    ref: "technologytype",
    required: false
  },
  status: {
    type: Schema.ObjectId,
    ref: "stepstatus",
    required: true
  },
  content: {
    type: String,
    required: false,
    trim: true
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  num: {
    type: Number,
    required: false,
    trim: true
  },
  createuser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: "user"
  },
  assigneduser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: "user"
  },
  lastedituser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: "user"
  },
  lasteditdata:{
    type: Date
  },
  partner: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: "partner"
  },
  issues:[{
    type: Schema.ObjectId,
    ref: "issue"
  }]
});

module.exports = mongoose.model("step", ValidationstepSchema);
