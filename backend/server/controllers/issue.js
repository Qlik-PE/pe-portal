var model = require('../models/issue');

module.exports = {
  get: function(query){
    model.find(query, function(err, results){
      if(err){
        console.log(err);
      }
      callbackFn.call(null, results);
    });
  }
};
