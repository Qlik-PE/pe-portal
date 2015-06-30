var certifications = require("./certifications");
var partners = require("./partners");

module.exports = function(app){
  //index
  app.get("/", function(req, res){
    res.render("../server/views/index.jade");
  });
  app.use("/certifications", certifications);
  app.use("/partners", partners);
};
