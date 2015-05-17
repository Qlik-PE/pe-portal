var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Cert Schema
 */
var ValidationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    //required: true,
    trim: true
  },
  technology_type: {
    type: String,
    //required: false,
    trim: true
  },
  content: {
    type: String,
    //required: true,
    trim: true
  },
  partner: {
    type: Schema.ObjectId,
    ref: 'partner'
  },
  qliksw: {
    type: String,
    //required: false,
    trim: true
  },
  qlikver: {
    type: String,
    //required: false,
    trim: true
  },
  partnersw: {
    type: String,
    //required: false,
    trim: true
  },
  partnerver: {
    type: String,
    //required: false,
    trim: true
  },
  connect_method: {
    type: String,
    //required: false,
    trim: true
  },
  dataset_used: {
    type: String,
    //required: false,
    trim: true
  },
  datamodel_desc: {
    type: String,
    //required: false,
    trim: true
  },
  data_density: {
    type: String,
    //required: false,
    trim: true
  },
  datavolume_cols: {
    type: Number,
    //required: false,
    trim: true
  },
  datavolume_rows: {
    type: Number,
    //required: false,
    trim: true
  },
  benchmarks: {
    type: String,
    //required: false,
    trim: true
  },
  host_os: {
    type: String,
    //required: false,
    trim: true
  },
  host_hw: {
    type: String,
    //required: false,
    trim: true
  },
  host_physVm: {
    type: String,
    //required: false,
    trim: true
  },
  host_cloudFg: {
    type: Boolean,
    //required: false,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('validation', ValidationSchema);
