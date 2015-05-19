var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Images = require('../../controllers/images'),
    Auth = require('../../controllers/auth');

router.get('/', Auth.isLoggedIn, function(req, res){

});

router.get('/:id', Auth.isLoggedIn, function(req,res){
  Images.get({_id: req.params.id}, function(images){
    if(images.length>0){
      res.contentType(images[0].mimetype);
      res.send(images[0].content);
    }
    else{
      res.json({errorCode: 404, errorText: "Image not found"});
    }
  });
});

module.exports = router;
