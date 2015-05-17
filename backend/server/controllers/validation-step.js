var model = require('../models/validation-step'),
    stepTypes = require('../models/validation-step-types');

module.exports = {
  get: function(query, callbackFn){
    console.log(query);
    model.find(query).populate('type').exec(function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  getTypes: function(callbackFn){
    stepTypes.find(function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  save: function(id, data, callbackFn){
    if(id){ //update
      model.findOneAndUpdate({_id:id}, data, function(err, result){
        if(err){
          console.log(err);
        }
        callbackFn.call(null, result);
      });
    }
    else{ //new
      model.create(data, function(err, result){
        if(err){
          console.log(err);
        }
        callbackFn.call(null, result);
      });
    }
  }
};
