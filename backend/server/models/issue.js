var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Certstep Schema
 */
var IssueSchema = new Schema({
  user: Schema.ObjectId,
  issuename: String,
  content: String,
  issuestatus: Schema.ObjectId,
  resolution: String,
  created: {
    type: Date,
    default: Date.now
  },
  stepid: Schema.ObjectId
});

module.exports = mongoose.model('issue', IssueSchema);
