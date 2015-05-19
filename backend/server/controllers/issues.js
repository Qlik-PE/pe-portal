var model = require('../models/issues'),
    Step = require('../models/steps'),
    issueStatus = require('../models/issue-status');

module.exports = {
  get: function(query, callbackFn){
    console.log(query);
    model.find(query).populate('status partner user').exec(function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  },
  getStatus: function(callbackFn){
    issueStatus.find({}, function(err, results){
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
        Step.findOne({_id: data.step}, function(err, step){
          if(err){
            console.log(err);
          }
          step.issues.push(result.id);
          step.save();
          model.findOne({_id:result.id}).populate('status').exec(function(err, result){
            if(err){
              console.log(err);
            }
            callbackFn.call(null, result);
          });
        })
      });
    }
  }
};
