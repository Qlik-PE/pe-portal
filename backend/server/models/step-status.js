var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var StepStatusSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createuser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('stepstatus', StepStatusSchema);
