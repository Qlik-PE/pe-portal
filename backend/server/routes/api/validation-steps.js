var express = require('express'),
    router = express.Router(),
    Validations = require('../../controllers/validation'),
    Step = require('../../controllers/validation-step'),
    Issue = require('../../controllers/issue'),
    Auth = require('../../controllers/auth');

router.get('/types', function(req, res){
  Step.getTypes(function(results){
    res.json(results);
  })
});

router.get('/status', function(req, res){
  Step.getStatus(function(results){
    res.json(results);
  })
});

router.post('/', Auth.isLoggedIn, function(req, res){
  console.log('posting withoutid');
  var user = req.user;
  if(user.role=='qlik' || user.role=='partner'){
    var data = req.body;
    data.user = user._id;
    ValidationStep.save(null, data, function(result){
      res.json({newId:result._id});
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
  console.log(data);
  var validationId = data.validationid;
  if(!validationId){
    res.json({errorCode:0, errorText:'Missing Validation Id'});
  }
  else{
    Validations.get({_id: validationId},function(validations){
      if(validations.length>0){
        if(user.role=='qlik'){
          Step.save(req.params.id, data, function(result){
            console.log(result);
            res.json(result);
          });
        }
        else if(user.role=='partner'){
          if(validations[0].partner.toString()==user.partner.toString()){
            Step.save(req.params.id, data, function(result){
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
  }
});

module.exports = router;
