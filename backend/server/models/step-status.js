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
  }
});

module.exports = mongoose.model('stepstatus', StepStatusSchema);
