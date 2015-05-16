var express = require('express'),
    router = express.Router(),
    Validations = require('../../controllers/validation'),
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



router.post('/', Auth.isLoggedIn, function(req, res){
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

module.exports = router;
