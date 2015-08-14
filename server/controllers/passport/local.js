var LocalStrategy    = require("passport-local").Strategy;

module.exports = function(passport, User){

	passport.use("local", new LocalStrategy({
            usernameField : "email",
            passwordField : "password",
            passReqToCallback : true
        },
        function(req, email, password, done) {
            // check in mongo if a user with username exists or not
            User.findOne({
              email: email
            }).populate("partner role").exec(function(err, user) {
              if (err) {
								console.log("passport error");
                return done(err);
              }
              if (!user) {
								console.log('email not found');
                return done('User Not Found with email '+email, false);
              }
              if (!user.authenticate(password)) {
                return done('Invalid Password', false);
              }
              return done(null, user);
            });

        })
    );
}
