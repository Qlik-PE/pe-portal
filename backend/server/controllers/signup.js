var Partner = require("../models/partners"),
    User = require("../models/users"),
    Error = require("./error");

module.exports = function(body, callbackFn){
  User.findOne({ "email" :  body.email }, function(err, user) {
      // In case of any error, return using the done method
      if (err){
          console.log("Error in SignUp: "+err);
          callbackFn.call(null, Error.custom(err));
      }
      // already exists
      if (user) {
          console.log("User already exists with email: "+body.email);
          callbackFn.call(null, Error.custom("User already exists with email: "+body.email));
      } else {
          // if there is no user with that email
          // create the user
          //create a new partner if no partnerid exists against the user data

          var newUser = new User(body);

          // set the user"s local credentials
          newUser.salt = newUser.makeSalt();
          newUser.hashed_password = newUser.hashPassword(body.password);
          newUser.email = body.email;
          newUser.username = body.email;
          console.log(newUser);
          // save the user
          console.log("body partnerid is - "+body.partner);
          console.log("newuser partnerid is - "+newUser.partner);
          if(!newUser.partner && body.partnername){
            Partner.save(null, {name: body.partnername}, function(result){
                newUser.partner = result._id
                newUser.save(function(err) {
                    if (err){
                        console.log("Error in Saving user: "+err);
                        callbackFn.call(null, Error.custom(err));
                    }
                    console.log("User Registration succesful");
                    callbackFn.call(null, newUser);
                });
            });
          }
          else{
            newUser.save(function(err) {
                if (err){
                    console.log("Error in Saving user: "+err);
                    callbackFn.call(null, Error.custom(err));
                }
                console.log("User Registration succesful");
                callbackFn.call(null, newUser);
            });
          }

      }
  });
}
