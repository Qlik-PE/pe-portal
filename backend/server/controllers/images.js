var model = require('../models/images');

module.exports = {
  get: function(query, callbackFn){
    model.find(query, function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  create: function(data, callbackFn){
    model.create(data, function(err, result){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, result);
    });
  }
};
