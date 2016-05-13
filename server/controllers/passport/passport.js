var User = require("../../models/users");

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).populate("role").exec(function(err, user) {
      done(err, user);
    });
  });

  //Configure login strategy
  require("./local.js")(passport, User);

  //configure signup strategy
  require("./signup.js")(passport, User);
};
