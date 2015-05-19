var express = require('express'),
    router = express.Router(),
    User = require('../../controllers/users'),
    Auth = require('../../controllers/auth');

//Get all users or users that match the provided query parameters
router.get("/", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  query['partner'] = req.user.partner;
  console.log(query);
  User.get(query, function(results){
    res.json(results);
  });

});

//Get a list of User Roles
router.get("/roles", Auth.isLoggedIn, function(req, res){
  User.getRoles(function(results){
    res.json(results);
  })
});

//Get a count of users that match the provided query parameters
router.get("/count", Auth.isLoggedIn, function(req, res){
  User.getCount(req.user.partner, req.query, function(result){
    res.json([result]);
  })
});

//Get a User by _id
router.get("/:id", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  if(req.user.role.name=="partner"){
    query['partner._id'] = req.user.partner; //we add the partnerId to the query to add an extra layer of security
  }
  query["_id"] = req.params.id;
  console.log(query);
  User.get(query, function(results){
    res.json(results);
  });

});

//Update an existing user by _id
router.post("/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id": req.params.id
  };
  if(req.user.role.name=="parter"){
    query['partner._id'] = req.user.partner;
  }
  User.get(query, function(users){
    if(users.length>0){
      User.save(req.params.id, req.body, function(result){
        res.json(result);
      });
    }
    else{
      res.json({errorCode: 1, errorText: "User does not exist or you do not have sufficient permissions."});
    }
  });
});

module.exports = router;
