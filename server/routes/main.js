var certifications = require('./certifications');

module.exports = function(app){
  //index
  app.get('/', function(req, res){
    res.render('../server/views/index.jade');
  });
  app.use('/certifications', certifications);
};
