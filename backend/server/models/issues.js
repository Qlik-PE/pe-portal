var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueSchema = new Schema({
  createuser: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  assigneduser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: 'user'
  },
  lastedituser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: 'user'
  },
  lasteditdate:{
    type: Date
  },
  partner: {
    type: Schema.ObjectId,
    ref: 'partner'
  },
  name: String,
  content: String,
  status: {
    type: Schema.ObjectId, ref: 'issuestatus'
  },
  resolution: String,
  created: {
    type: Date,
    default: Date.now
  },
  step: Schema.ObjectId
});

module.exports = mongoose.model('issue', IssueSchema);
