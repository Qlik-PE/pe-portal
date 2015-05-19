var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var IssueSchema = new Schema({
  user: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: 'user'
  },
  partner: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: 'partner'
  },
  name: String,
  content: String,
  status: {
    type: Schema.ObjectId,
    ref: 'issuestatus'
  },
  resolution: String,
  created: {
    type: Date,
    default: Date.now
  },
  step: Schema.ObjectId
});

module.exports = mongoose.model('issue', IssueSchema);
