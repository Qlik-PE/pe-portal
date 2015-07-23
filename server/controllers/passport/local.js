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
                return done(err);
              }
              if (!user) {
                return done(null, false, {
                  message: "Unknown user"
                });
              }
              if (!user.authenticate(password)) {
                return done(null, false, {
                  message: "Invalid password"
                });
              }
              return done(null, user);
            });

        })
    );
}
