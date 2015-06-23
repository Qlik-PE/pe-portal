var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var TechnologyTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // steps:[{
  //   name: String,
  //   content: String,
  //   type: {
  //     type: Schema.ObjectId,
  //     ref: "steptypes"
  //   },
  //   status: {
  //     type: Schema.ObjectId,
  //     ref: "stepstatus"
  //   },
  //   num: Number
  // }],
  createuser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('technologytype', TechnologyTypeSchema);
