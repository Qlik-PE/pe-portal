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
    users       : require("../../controllers/users"),
    userroles       : require("../../controllers/user-roles")
};

//This route is for getting a list of results for the specified entity
//url parameters can be used to add filtering
//Requires 'read' permission on the specified entity
router.get("/:entity", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  var entity = req.params.entity;
  var user = req.user;
  var userPermissions = req.user.role.permissions[entity];
  //check that the user has sufficient permissions for this operation
  if(!userPermissions || userPermissions.read!=true){
    res.json([Error.insufficientPermissions]);
  }
  else{
    if(userPermissions.allOwners!=true){
      query['partner']=user.partner;
    }
    console.log(query);
    controllers[entity].get(query, function(results){
      res.json(results);
    });
  }
});

//This route is for getting a count of results for the specified entity
//url parameters can be used to add filtering
//Requires 'read' permission on the specified entity
router.get("/:entity/count", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  var entity = req.params.entity;
  var user = req.user;
  var userPermissions = req.user.role.permissions[entity];
  //check that the user has sufficient permissions for this operation
  if(!userPermissions || userPermissions.read!=true){
    res.json([Error.insufficientPermissions]);
  }
  else{
    if(userPermissions.allOwners!=true){
      query['partner']=user.partner;
    }
    console.log(query);
    controllers[entity].getCount(query, function(results){
      res.json([results]);
    });
  }
});

//This route is for getting a specific result from the specified entity
//url parameters can be used to add filtering
//Requires 'read' permission on the specified entity
router.get("/:entity/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id":req.params.id
  };
  var entity = req.params.entity;
  var user = req.user;
  var userPermissions = req.user.role.permissions[entity];
  //check that the user has sufficient permissions for this operation
  if(!userPermissions || userPermissions.read==false){
    res.json([Error.insufficientPermissions]);
  }
  else{
    if(userPermissions.allOwners!=true){
      query['partner']=user.partner;
    }
    controllers[entity].get(query,function(results){
      if(results.length>0){
        res.json(results);
      }
      else{
        res.json([Error.insufficientPermissions]);
      }
    });
  }
});

//This route is for creating a new record on the specified entity and returning the new record
//Requires 'create' permission on the specified entity
router.post("/:entity/", Auth.isLoggedIn, function(req, res){
  var entity = req.params.entity;
  var user = req.user;
  var userPermissions = req.user.role.permissions[entity];
  if(!userPermissions || userPermissions.create!=true){
    res.json(Error.insufficientPermissions);
  }
  else{
    controllers[entity].save(null, req.body, function(result){
      res.json(result);
    });
  }
});


//This route is for saving a specific record on the specified entity
//url parameters can be used to add filtering
//Requires 'update' permission on the specified entity
router.post("/:entity/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id": req.params.id
  };
  var entity = req.params.entity;
  var user = req.user;
  var userPermissions = req.user.role.permissions[entity];
  console.log(userPermissions);
  //check that the user has sufficient permissions for this operation
  if(!userPermissions || userPermissions.update!=true){
    res.json(Error.insufficientPermissions);
  }
  else{
    if(userPermissions.allOwners!=true){
      query['partner']=user.partner;
    }

    controllers[entity].get(query, function(records){
      if(records.length > 0){
        controllers[entity].save(req.params.id, req.body, function(result){
          res.json(result);
        });
      }
      else{
        res.json(Error.noRecord);
      }
    });
  }
});

module.exports = router;
