var model = require("../models/user-roles");

module.exports = {
  get: function(query, callbackFn){
    model.find(query, function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  getRoles: function(query, callbackFn){
    UserRoles.find(query, function(err, result){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, result);
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
    if(id){
      model.findOneAndUpdate({_id:id}, data, function(err, result){
        if(err){
          console.log(err);
        }
        callbackFn.call(null, result);
      });
    }
    else{
      model.create(data, function(err, result){
        if(err){
          console.log(err);
        }
        callbackFn.call(null, result);
      });
    }
  }
};
