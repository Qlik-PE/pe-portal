var express = require('express'),
    router = express.Router(),
    Error = require('../../controllers/error'),
    Partners = require('../../controllers/partners');

router.get('/userpermissions', function(req, res){
  if(req.user&&req.user.role){
    res.json(req.user.role.permissions);
  }
  else{
    res.json(Error.notLoggedIn);
  }
});

router.get("/partners", function(req, res){ //used to check for existing partners in the signup process
  var query = req.query || {};
  //query={name:/Qli/gi};
  var params = req.params;
  console.log(params);
  console.log(query);
  Partners.get(query, function(results){
    res.json(results);
  });
});



module.exports = router;
