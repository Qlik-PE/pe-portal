var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
  res.render("../server/views/certifications/index.jade");
});

router.get("/detail", function(req, res){  
  res.render("../server/views/certifications/detail.jade");
});
module.exports = router;
