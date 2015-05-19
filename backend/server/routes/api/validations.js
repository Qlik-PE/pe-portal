var express = require("express"),
    router = express.Router(),
    Validations = require("../../controllers/validations"),
    ValidationStep = require("../../controllers/steps"),
    Images = require("../../controllers/images"),
    Auth = require("../../controllers/auth"),
    busboy = require("connect-busboy");

//router.use(Auth.isLoggedIn());

router.get("/", Auth.isLoggedIn, function(req, res){
  var query = {}
  if(req.user.role.name=="partner"){
    query['partner']=req.user.partner;
  }
  Validations.get(query, function(validations){
    res.json(validations);
  });
});

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

router.post("/", Auth.isLoggedIn, function(req, res){
  var data = req.body;
  data.partner = req.user.partner;
  data.user = req.user._id;
  Validations.save(null, data, function(result){
    res.json({redirect:"#validations/"+result._id});
  });

});

router.post("/:id", Auth.isLoggedIn, function(req, res){
  var query = {
    "_id":req.params.id
  };
  if(req.user.role.name=="partner"){ //we add the partnerId to the query to add an extra layer of security
    query['partner']=req.user.partner;
  }
  Validations.get(query,function(validations){
    if(validations.length>0){
      Validations.save(req.params.id, req.body, function(result){
        res.json(result);
      });
    }
    else{
      res.json({errorCode: 1, errorText: "Validation does not exist or you do not have sufficient permissions."});
    }
  });
});

//cleaned to here

router.post("/:id/image", Auth.isLoggedIn, function(req, res){
  var user = req.user;
  Validations.get({_id: req.params.id},function(validations){
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      var data = {};
      data.content = "";
      data.mimetype = mimetype;
      data.filename= filename;
      data.entityid = req.params.id;
      file.on("data", function(chunk){
        data.content += chunk;
      });
      file.on("end", function(){
        data.content = new Buffer(data.content);
        Images.create(data, function(result){
          if(result._id){
            validations[0].screenshots.push(result._id);
            validations[0].save();
            res.json(result);
          }
        })
      });
    });
  });
});

//get the steps for a validation
router.get("/:id/step", Auth.isLoggedIn, function(req, res){
  console.log("getting steps");
  ValidationStep.get({validationid:req.params.id}, function(steps){

    console.log(steps);
    res.json(steps);
  });
});




//save a validation step
router.post("/:vid/step/:sid", Auth.isLoggedIn, function(req, res){
  console.log("posting with id");
  var user = req.user;
  var data = req.body;
  console.log(data);
  Validations.get({_id: req.params.vid},function(validations){
    if(validations.length>0){
      if(user.role=="qlik"){
        ValidationStep.save(req.params.sid, data, function(result){
          console.log(result);
          res.json(result);
        });
      }
      else if(user.role=="partner"){
        if(validations[0].partner.toString()==user.partner.toString()){
          ValidationStep.save(req.params.sid, data, function(result){
            res.json(result);
          });
        }
        else{
          res.json({errorCode:401, errorText:"Incorrect Ownership"});
        }
      }
      else{
        res.json({errorCode:401, errorText:"Insufficient Permissions"});
      }
    }
    else{
      res.json({errorCode:404, errorText:"Validation Not Found"});
    }
  });
});

//get the issue for the given validationid and stepid
router.get("/:vid/step/:sid/issue", Auth.isLoggedIn, function(req, res){
  var user = req.user;
  ValidationStep.getWithValidation({_id: req.params.sid},function(steps){
    if(steps.length>0){
      Issues.get({}, function(issues){
        steps[0].issues = issues;
        if(user.role=="qlik"){
          res.json(steps);
        }
        else if(user.role=="partner"){
          if(steps[0].validationid.partner.toString()==user.partner.toString()){
            res.json(result);
          }
          else{
            res.json({errorCode:401, errorText:"Incorrect Ownership"});
          }
        }
        else{
          res.json({errorCode:401, errorText:"Insufficient Permissions"});
        }
      });
    }
    else{
      res.json({errorCode:404, errorText:"Validation Not Found"});
    }
  });
});

module.exports = router;
