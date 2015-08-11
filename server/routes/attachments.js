var express = require("express"),
    router = express.Router(),
    Error = require('../controllers/error'),
    Attachment = require('../models/attachments'),
    atob = require('atob');

router.get('/', function(req, res){
  var a = new Attachment;

    var b = [];
    a.mimetype = mimetype;
    a.filename = filename;
    a.entityId = req.body.entityId;
    a.entityId = "55c332f15c3d8a01044e60ae";
    a.content = '';
    file.on('data', function(chunk){
      //a.content += chunk;
      b.push(chunk);
    });

    file.on('end', function(){
      a.content = Buffer.concat(b);
      a.save(function(error, result){
        if(error){
          console.log(error);
          res.json(Error.custom(error));
        }
        else{
          res.json(result);
        }
      });
    });

  //})
});

router.get('/:id', function(req, res){
  Attachment.findOne({_id: req.params.id}, function(err, data){
    console.log(data.content);
    if(err){
      res.json(Error.custom(err));
    }
    else{
      res.contentType("image/png");
      res.send(data.content);
    }
  });
});

router.post('/', function(req, res){
  console.log('attempting to post');
  var a = new Attachment;
  console.log(req.body);

  req.pipe(req.busboy);
  console.log('3');
  req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var b = [];
    console.log('4');
    console.log(file);
    a.mimetype = mimetype;
    a.filename = filename;
    a.entityId = req.body.entityId;
    a.entityId = "55c332f15c3d8a01044e60ae";
    a.content = '';
    file.on('data', function(chunk){
      //a.content += chunk;
      b.push(chunk);
    });

    file.on('end', function(){
      a.content = Buffer.concat(b);
      a.save(function(error, result){
        if(error){
          console.log(error);
          res.json(Error.custom(error));
        }
        else{
          res.json(result);
        }
      });
    });
    //a.content = file;

  })
});

module.exports = router;
