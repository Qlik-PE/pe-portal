var model = require("../models/step-types");

module.exports = {
  get: function(query, callbackFn){
    model.find(query, function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  getCount: function(query, callbackFn){
    model.count(query, function(err, result){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, result);
    });
  },
  save: function(id, data, callbackFn){
    model.findOneAndUpdate({_id:id}, data, function(err, result){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, result);
    });
  }
};
