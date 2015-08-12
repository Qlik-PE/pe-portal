var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Error = require("../controllers/error"),
    Auth = require("../controllers/auth"),
    nodemailer = require("nodemailer"),
    Signup = require("../controllers/signup");

// router.post("/login", passport.authenticate("local"), function(req, res){
//   console.log(req.isAuthenticated());
//   res.redirect("/");
// });

router.post("/login", passport.authenticate("local",{successRedirect: "/#dashboard", failureRedirect: ""}));
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

router.post("/signup", function(req, res){
  Signup(req.body, function(result){
    res.json(result);
  });
});

router.post("/forgot", Auth.generateResetToken, function(req, res){
  console.log('token is');
  console.log(req.token);
  var smtpTransport = nodemailer.createTransport();
  var options = {
    from: "admin@pvportal.com",
    to: req.body.email,
    subject: "PV Portal Password Reset",
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
         encodeURI('http://' + req.headers.host + '/#resetpassword?token=' + req.token + '\n\n') +
         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };
  smtpTransport.sendMail(options, function(err){
    if(err){
      console.log(err);
    }
    else{
      res.json({redirect:"#forgotsent?"+req.body.email})
    }
  })
});

router.get("/reset/:token", Auth.getUserIdForReset, function(req, res){
  res.json({id:req.userId});
});

router.post("/reset", Auth.resetPassword, function(req, res){
  res.json({redirect:"#login"});
});

module.exports = router;
