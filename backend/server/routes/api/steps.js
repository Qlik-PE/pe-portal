var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    Validations = require("../../controllers/validations"),
    Step = require("../../controllers/steps"),
    Issue = require("../../controllers/issues"),
    Auth = require("../../controllers/auth");

//Get all steps or steps that match the provided query parameters
router.get("/", Auth.isLoggedIn, function(req, res){
  console.log(req.query);
  Step.get(req.query, function(results){
    console.log()
    res.json(results);
  });

});

//Get a list of Step Types
router.get("/types", Auth.isLoggedIn, function(req, res){
  console.log('getting types');
  Step.getTypes(function(results){
    res.json(results);
  })
});

//Get a list of Step Status
router.get("/status", Auth.isLoggedIn, function(req, res){
  Step.getStatus(function(results){
    res.json(results);
  })
});

//Get a step by _id
router.get("/:id", Auth.isLoggedIn, function(req, res){
  var query = req.query || {};
  if(req.user.role.name=="partner"){
    query['partner'] = req.user.partner; //we add the partnerId to the query to add an extra layer of security
  }
  query["_id"] = req.params.id;
  console.log(query);
  Step.get(query, function(results){
    res.json(results);
  });

});

//Create a new step for the specified validation id
router.post("/", Auth.isLoggedIn, function(req, res){
  if(!req.body || !req.body.validationid){
    res.json({errorCode: 0, errorText:"Missing Validation Id"});
  }
  else{
    var data = req.body;
    data.user = req.user._id;
    data.partner = req.user.partner;
    Step.save(null, data, function(result){
      res.json(result);
    });
  }
});

//Update an existing step by _id
router.post("/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id": req.params.id
  };
  if(req.user.role.name=="parter"){
    query['partner'] = req.user.partner;
  }
  Step.get(query, function(steps){
    if(steps.length>0){
      Step.save(req.params.id, req.body, function(result){
        res.json({newId:result._id});
      });
    }
    else{
      res.json({errorCode: 1, errorText: "Step does not exist or you do not have sufficient permissions."});
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
  Step.delete(query, function(result){
    res.json(result);
  })
});

module.exports = router;
