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
  steps:[{
    name: String,
    num: Number,
    _id: Schema.ObjectId
  }],
  createuser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('technologytype', TechnologyTypeSchema);
