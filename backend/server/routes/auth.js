var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Error = require("../controllers/error");

// router.post("/login", passport.authenticate("local"), function(req, res){
//   console.log(req.isAuthenticated());
//   res.redirect("/");
// });

router.post("/login", passport.authenticate("local",{successRedirect: "/#dashboard", failureRedirect: ""}));
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

router.post("/signup", passport.authenticate("signup"), function(req, res){
  res.redirect("/#dashboard")
});

module.exports = router;
