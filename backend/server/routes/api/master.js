var express = require('express'),
    router = express.Router(),
    Auth = require('../../controllers/auth'),
    Error = require('../../controllers/error');

//Include all Controllers for now
//This should later be changed for a 'master' controller
var controllers = {
    validations : require("../../controllers/validations"),
    steps       : require("../../controllers/steps"),
    issues      : require("../../controllers/issues"),
    users       : require("../../controllers/users")
};

//This route is for getting a list of results for the specified entity
//url parameters can be used to add filtering
//Requires 'read' permission on the specified entity
router.get("/:entity", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  var entity = req.params.entity;
  var user = req.user;
  console.log(req.user.role.permissions);
  var userPermissions = req.user.role.permissions[entity];
  //check that the user has sufficient permissions for this operation
  if(!userPermissions || userPermissions.read==false){
    res.json([Error.insufficientPermissions]);
  }
  else{
    if(user.role.onlyOwn==true){
      query['partner']=user.partner;
    }
    controllers[entity].get(query, function(results){
      res.json(results);
    });
  }
});

//This route is for getting a specific result from the specified entity
//url parameters can be used to add filtering
//Requires 'read' permission on the specified entity
router.get("/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id":req.params.id
  };
  if(req.user.role.name=="partner"){ //we add the partnerId to the query to add an extra layer of security
    query['partner']=req.user.partner;
  }
  Validations.get(query,function(validations){
    if(validations.length>0){
      res.json(validations);
    }
    else{
      res.json({errorCode: 1, errorText: "Validation does not exist or you do not have sufficient permissions."});
    }
  });
});

module.exports = router;
