var mongoose = require('mongoose'),
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
    ref: 'steptype',
    required: false
  },
  validationid: {
    type: String,
    required: true
  },
  status: {
    type: Schema.ObjectId,
    ref: 'stepstatus',
    required: true
  },
  content: {
    type: String,
    required: false,
    trim: true
  },
  num: {
    type: Number,
    required: false,
    trim: true
  },
  user: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: 'user'
  },
  issues:[{
    type: Schema.ObjectId,
    ref: 'issue'
  }]
});

module.exports = mongoose.model('validationstep', ValidationstepSchema);
