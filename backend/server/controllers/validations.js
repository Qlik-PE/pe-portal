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
  getCount: function(query, callbackFn){
    console.log('getting count of validations');
    model.count(query, function(err, result){
      if(err){
        console.log(err);
      }
      console.log(result);
      callbackFn.call(null, result);
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
  },
  delete: function(query, callbackFn){
    model.findOne(query).remove().exec(function(err){
      if(err){
        callbackFn.call(null, error);
      }
      else{
        callbackFn.call(null, {result: "success"})
      }
    })
  }
};
