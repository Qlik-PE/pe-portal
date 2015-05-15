var User = require('../../models/user');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    console.log('serializing user - '+user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('de-serializing user');
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //Configure login strategy
  require('./local.js')(passport, User);

  //configure signup strategy
  require('./signup.js')(passport, User);
}
