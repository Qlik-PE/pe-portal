var express = require('express'),
    router = express.Router(),
    Issue = require('../../controllers/issues'),
    Auth = require('../../controllers/auth');

//Get all issues or issues that match the provided query parameters
router.get("/", Auth.isLoggedIn, function(req, res){
  console.log(req.query);
  Issue.get(req.query, function(results){
    console.log()
    res.json(results);
  });

});

//Get a list of Issue Status
router.get("/status", Auth.isLoggedIn, function(req, res){
  Issue.getStatus(function(results){
    res.json(results);
  })
});

//Get a count of users that match the provided query parameters
router.get("/count", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  if(req.user.role.name=="partner"){
    query['partner'] = req.user.partner; //we add the partnerId to the query to add an extra layer of security
  }
  Issue.getCount(query, function(result){
    res.json([result]);
  })
});

//Get a issue by _id
router.get("/:id", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  if(req.user.role.name=="partner"){
    query['partner'] = req.user.partner; //we add the partnerId to the query to add an extra layer of security
  }
  query["_id"] = req.params.id;
  console.log(query);
  Issue.get(query, function(results){
    res.json(results);
  });

});

//Create a new issue for the specified step id
router.post("/", Auth.isLoggedIn, function(req, res){
  if(!req.body || !req.body.step){
    res.json({errorCode: 0, errorText:"Missing Step Id"});
  }
  else{
    var data = req.body;
    data.user = req.user._id;
    data.partner = req.user.partner;
    Issue.save(null, data, function(result){
      res.json(result);
    });
  }
});

//Update an existing issue by _id
router.post("/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id": req.params.id
  };
  if(req.user.role.name=="parter"){
    query['partner'] = req.user.partner;
  }
  Issue.get(query, function(issues){
    if(issues.length>0){
      Issue.save(req.params.id, req.body, function(result){
        res.json(result);
      });
    }
    else{
      res.json({errorCode: 1, errorText: "Issue does not exist or you do not have sufficient permissions."});
    }
  });
});

router.delete('/:id', Auth.isLoggedIn, function(req, res){
  var query = {
    "_id":req.params.id
  };
  if(req.user.role.name=="partner"){ //we add the partnerId to the query to add an extra layer of security
    query['partner']=req.user.partner;
  }
  Issue.delete(query, function(result){
    res.json(result);
  })
});

module.exports = router;
