var express = require("express"),
    router = express.Router(),
    Error = require("../../controllers/error"),
    Partners = {
      model: require("../../models/partners"),
      populates: ""
    },
    MasterController = require("../../controllers/master");

router.get("/userpermissions", function(req, res){
  if(req.user&&req.user.role){
    res.json(req.user.role);
  }
  else{
    res.json({redirect:"#login"});
  }
});

router.get("/partners", function(req, res){ //used to check for existing partners in the signup process
  var query = req.query || {};
  //query={name:/Qli/gi};
  var params = req.params;
  MasterController.get(req.query, query, Partners, function(results){
    res.json(results);
  });
});



module.exports = router;
