var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserRoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  permissions:{
    //example
    // validations:{
    //   allOwners: false,
    //   create: true,
    //   read: true,
    //   update: true,
    //   delete: false
    // }
  }
});

module.exports = mongoose.model('userrole', UserRoleSchema);
