var express = require('express'),
    router = express.Router(),
    Validations = require('../../controllers/validation'),
    ValidationStep = require('../../controllers/validation-step'),
    Auth = require('../../controllers/auth');

//router.use(Auth.isLoggedIn());

router.get('/', Auth.isLoggedIn, function(req, res){
  var user = req.user;
  if(user.role=='qlik'){
    //user can administer all validations
    Validations.get({},function(validations){
      res.json(validations);
    });

  }
  else if(user.role=='partner'){
    console.log('getting validations for partner - '+ user.partner);
    //user can administer validations assigned to their partner id
    Validations.get({partner: user.partner}, function(validations){
      res.json(validations);
    });
  }
  else{
    //user cannot create/edit validations
  }
});

router.get('/:id', Auth.isLoggedIn, function(req, res){
  var user = req.user;
  Validations.get({_id: req.params.id},function(validations){
    if(validations.length>0){
      if(user.role=='qlik'){
        res.json(validations);
      }
      else if(user.role=='partner'){
        if(validations[0].partner.toString()==user.partner.toString()){
          res.json(validations);
        }
        else{
          res.json({errorCode:401, errorText:'Incorrect Ownership'});
        }
      }
      else{
        res.json({errorCode:401, errorText:'Insufficient Permissions'});
      }
    }
    else{
      res.json({errorCode:404, errorText:'Validation Not Found'});
    }
  });
});

router.post('/', Auth.isLoggedIn, function(req, res){
  console.log('posting withoutid');
  var user = req.user;
  if(user.role=='qlik' || user.role=='partner'){
    var data = req.body;
    data.partner = user.partner;
    data.user = user._id;
    Validations.save(null, data, function(result){
      res.json({redirect:'#myvalidations/'+result._id});
    });
  }
  else{
    res.json({errorCode:401, errorText:'Insufficient Permissions'});
  }
});

router.post('/:id', Auth.isLoggedIn, function(req, res){
  console.log('posting with id');
  var user = req.user;
  var data = req.body;
  Validations.get({_id: req.params.id},function(validations){
    if(validations.length>0){
      if(user.role=='qlik'){
        Validations.save(req.params.id, data, function(result){
          console.log(result);
          res.json(result);
        });
      }
      else if(user.role=='partner'){
        if(validations[0].partner.toString()==user.partner.toString()){
          Validations.save(req.params.id, data, function(result){
            res.json(result);
          });
        }
        else{
          res.json({errorCode:401, errorText:'Incorrect Ownership'});
        }
      }
      else{
        res.json({errorCode:401, errorText:'Insufficient Permissions'});
      }
    }
    else{
      res.json({errorCode:404, errorText:'Validation Not Found'});
    }
  });
});

//get the steps for a validation
router.get('/:id/step', Auth.isLoggedIn, function(req, res){
  console.log('getting steps');
  ValidationStep.get({validationid:req.params.id}, function(steps){
    console.log(steps);
    res.json(steps);
  });
});

//save a validation step
router.post('/:vid/step/:sid', Auth.isLoggedIn, function(req, res){
  console.log('posting with id');
  var user = req.user;
  var data = req.body;
  console.log(data);
  Validations.get({_id: req.params.vid},function(validations){
    if(validations.length>0){
      if(user.role=='qlik'){
        ValidationStep.save(req.params.sid, data, function(result){
          console.log(result);
          res.json(result);
        });
      }
      else if(user.role=='partner'){
        if(validations[0].partner.toString()==user.partner.toString()){
          ValidationStep.save(req.params.sid, data, function(result){
            res.json(result);
          });
        }
        else{
          res.json({errorCode:401, errorText:'Incorrect Ownership'});
        }
      }
      else{
        res.json({errorCode:401, errorText:'Insufficient Permissions'});
      }
    }
    else{
      res.json({errorCode:404, errorText:'Validation Not Found'});
    }
  });
});


module.exports = router;
