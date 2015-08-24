var LocalStrategy    = require("passport-local").Strategy;
var Partner = require("../../models/partners");

module.exports = function(passport, User){
	passport.use("signup", new LocalStrategy({
            usernameField : "email",
            passwordField : "password",
						passReqToCallback : true
        },
        function(req, email, password, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ "email" :  email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log("Error in SignUp: "+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        return done("User already exists with email: "+email, false);
                    } else {
                        // if there is no user with that email
                        // create the user
												//create a new partner if no partnerid exists against the user data

                        var newUser = new User(req.body);

                        // set the user"s local credentials
                        newUser.salt = newUser.makeSalt();
                        newUser.hashed_password = newUser.hashPassword(password);
                        newUser.email = email;
												newUser.username = email;
                        console.log(newUser);
                        // save the user
												if(!req.body.partner&&!req.body.partnername){
													return done("Partner is required", false);
												}
												if(!newUser.partner && req.body.partnername){
													var partner = new Partner()
													partner.name = req.body.partnername;
													partner.save(function(err, result){
														if(err){
															return done(err.message, false);
														}
														else{
															newUser.partner = result._id
															newUser.save(function(err) {
			                            if (err){
																		console.log(err.message);
			                              return done(err.message, false);
			                            }
																	else{
				                            return done(null, newUser);
																	}
			                        });
														}
													});
												}
												else{
													newUser.save(function(err) {
														if (err){
															console.log(err);
															return done(err.message, false);
														}
														else{
															return done(null, newUser);
														}
													});
												}

                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );
}
