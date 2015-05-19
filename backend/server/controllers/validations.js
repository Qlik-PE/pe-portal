var model = require('../models/validations');

module.exports = {
  get: function(query, callbackFn){
    model.find(query, function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  save: function(id, data, callbackFn){
    if(id){ //update
      //before saving we'll remove the partner data from the validation object
      delete data.partner;
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
