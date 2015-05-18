var model = require('../models/validation-step'),
    stepTypes = require('../models/validation-step-types'),
    stepStatus = require('../models/validation-step-status');

module.exports = {
  get: function(query, callbackFn){
    console.log(query);
    model.find(query).populate('type status issues').exec(function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  // getWithValidation:function(query, callbackFn){
  //   model.find(query).populate('type status validation').exec(function(err, results){
  //     if(err){
  //       console.log(err);
  //     }
  //     callbackFn.call(null, results);
  //   });
  // },
  getTypes: function(callbackFn){
    stepTypes.find({},function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  getStatus: function(callbackFn){
    console.log('getting step status list from controller');
    stepStatus.find({}, function(err, results){
      if(err){
        console.log(err);
      }
      console.log(results);
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
        model.findOne({_id:result.id}).populate('type status').exec(function(err, result){
          if(err){
            console.log(err);
          }
          callbackFn.call(null, result);
        });
      });
    }
  }
};
