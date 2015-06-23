var LocalStrategy    = require('passport-local').Strategy;
var Partner = require('../../models/partners');

module.exports = function(passport, User){
	passport.use('signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            findOrCreateUser = function(){
              console.log('here');
                // find a user in Mongo with provided username
                User.findOne({ 'email' :  email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with email: '+email);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
												//create a new partner if no partnerid exists against the user data

                        var newUser = new User(req.body);

                        // set the user's local credentials
                        newUser.salt = newUser.makeSalt();
                        newUser.hashed_password = newUser.hashPassword(password);
                        newUser.email = req.param('email');
												newUser.username = req.param('email');
                        console.log(newUser);
                        // save the user
												console.log('body partnerid is - '+req.body.partner);
												console.log('newuser partnerid is - '+newUser.partner);
												if(!newUser.partner && req.body.partnername){
													Partner.save(null, {name: req.body.partnername}, function(result){
															newUser.partner = result._id
															newUser.save(function(err) {
			                            if (err){
			                                console.log('Error in Saving user: '+err);
			                                throw err;
			                            }
			                            console.log('User Registration succesful');
			                            return done(null, newUser);
			                        });
													});
												}
												else{
													newUser.save(function(err) {
															if (err){
																	console.log('Error in Saving user: '+err);
																	throw err;
															}
															console.log('User Registration succesful');
															return done(null, newUser);
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
