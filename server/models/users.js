var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    crypto = require("crypto");

var UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    //match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"],
    //validate: [validateUniqueEmail, "E-mail address is already in-use"]
  },
  // username: {
  //   type: String
  //   //unique: true
  // },
  role: {
    type: Schema.ObjectId,
    ref: "userrole",
    default: "555b5a870f9ceeb01eaa0355"
  },
  partner: {
    type: Schema.ObjectId,
    ref: "partner"
  },
  hashed_password: {
    type: String
    //validate: [validatePresenceOf, "Password cannot be blank"]
  },
  provider: {
    type: String,
    default: "local"
  },
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {}
});

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
  },
  hashPassword: function(password) {
    if (!password || !this.salt) return "";
    var salt = new Buffer(this.salt, "base64");
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString("base64");
  },
  makeSalt: function() {
    return crypto.randomBytes(16).toString("base64");
  }
};

module.exports = mongoose.model("user", UserSchema);
