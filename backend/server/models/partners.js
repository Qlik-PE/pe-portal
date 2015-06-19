var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Partner Schema
 */
var PartnerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    //required: true,
    trim: true
  },
  technology: {
    type: String,
    //required: true,
    trim: true
  },
  weburl: {
    type: String,
    required: false,
    trim: true
  },
  user: {  //User associated with the partner
    type: Schema.ObjectId,
    ref: 'User'
  },
  createuser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('partner', PartnerSchema);
