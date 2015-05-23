var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserRoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  onlyOwn: Boolean,
  permissions:{}
});

module.exports = mongoose.model('userrole', UserRoleSchema);
