var mongoose = require("mongoose"),
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
    type: Schema.ObjectId,
    ref: "technologytype"
  },
  content: {
    type: String,
    //required: true,
    trim: true
  },
  status:{
    type: String,
    default: "pending"
  },
  partner: {
    type: Schema.ObjectId,
    ref: "partner"
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
  createuser: {
    type: Schema.ObjectId,
    ref: "user"
  },
  assigneduser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: "user"
  },
  lastedituser: {  //User associated with the certstep
    type: Schema.ObjectId,
    ref: "user"
  },
  lasteditdate:{
    type: Date
  },
  screenshots:[{type:String}]
});

module.exports = mongoose.model("validation", ValidationSchema);
