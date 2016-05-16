var User     = require("../models/users");
var btoa     = require("btoa");
var atob     = require("atob");
var Error    = require("./error");

module.exports = {
  isLoggedIn: function(req, res, next){
    console.log('checking auth for '+req.params.entity);
    if(req.isAuthenticated()){
      next();
    }
    else if(req.headers.authorization){
      var ascii = req.headers.authorization.split(" ").pop();
      var credentials = atob(ascii).split(":");
      var username = credentials[0], password = credentials[1];
      User.findOne({email: username}).populate("role partner").exec(function(err, user){
        if(user.authenticate(password)==true){
          req.user = user;
          next();
        }
        else {
          res.json({errorCode: 401, errorText: "User not logged in", redirect: "#login"})
        }
      });
    }
    else if(req.headers.username && req.headers.password){
      User.findOne({email: req.headers.username}).populate("role partner").exec(function(err, user){
        if(user.authenticate(req.headers.password)==true){
          req.user = user;
          next();
        }
        else {
          res.json({errorCode: 401, errorText: "User not logged in", redirect: "#login"})
        }
      });
    }
    else{
      res.json({errorCode: 401, errorText: "User not logged in", redirect: "#login"})
    }
  },
  generateResetToken: function(req, res, next){
    User.findOne({email: req.body.email}, function(err, result){
      if(err || result == null){
        res.json(Error.custom("User not found with email "+req.body.email));
      }
      else{
        var token = result.generateResetToken();
        req.token = token;
        next();
      }
    });
  },
  getUserIdForReset: function(req, res, next){
    User.findOne({resetPasswordToken: req.params.token}, function(err, result){
      if(err){
        res.json(Error.custom(err));
      }
      else if(result){
        if(result.resetPasswordExpires.getTime() > Date.now()){
          req.userId = result._id;
          next();
        }
        else{
          res.json(Error.custom("Token Expired"));
        }
      }
      else{
        res.json(Error.custom("Invalid Token"));
      }
    });
  },
  resetPassword: function(req, res, next){
    console.log(req.body);
    console.log(req.params);
    User.findOne({_id: req.body.id}, function(err, result){
      if(err){
        res.json(Error.custom(err));
      }
      else{
        result.updatePassword(req.body.password);
        next();
      }
    });
  }
}
