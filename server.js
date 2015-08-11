var express = require("express"),
    app = express();
    passport = require("passport"),
    expressSession = require("express-session"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    busboy = require("connect-busboy"),
    fs = require('fs'),
    pdf = require('phantomjs-pdf'),
    request = require('request'),
    htmltopdf = require('wkhtmltopdf');

app.use(busboy());

mongoose.connect("mongodb://localhost:27017/pe-portal");

//load the models
require(__dirname+"/server/models/users");
require(__dirname+"/server/models/partners");
require(__dirname+"/server/models/validations");
require(__dirname+"/server/models/steps");
require(__dirname+"/server/models/step-types");
require(__dirname+"/server/models/step-status");
require(__dirname+"/server/models/attachments");
require(__dirname+"/server/models/status-history");
require(__dirname+"/server/models/issues");

//configure passport strategies
require(__dirname+"/server/controllers/passport/passport")(passport);

//route controllers
var systemRoutes = require(__dirname+"/server/routes/system/system");
var apiRoutes = require(__dirname+"/server/routes/api/api");
var attachmentRoutes = require(__dirname+"/server/routes/attachments");
var authRoutes = require(__dirname+"/server/routes/auth");

app.use("/views", express.static(__dirname + "/public/views"));
app.use("/templates", express.static(__dirname + "/public/templates"));
app.use("/css", express.static(__dirname + "/public/styles/css"));
app.use("/resources", express.static(__dirname + "/public/resources"));
app.use("/js", express.static(__dirname + "/public/scripts/build"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/print", express.static(__dirname + "/public/temp"));
app.use("/qsocks", express.static(__dirname + "/node_modules/qsocks"));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '2mb'}));

app.use(expressSession({secret: "qlikPEPortal"})); //ATTENTION - need to find out what the secret key is
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res){
  res.render(__dirname+"/server/views/index.jade", {isAuthenticated: req.isAuthenticated(), user: req.user});
});
app.get("/sysprint/:report/:entity/:id", function(req, res){
  console.log(req.params);
  res.render(__dirname+"/server/views/print.jade");
});

app.get("/print/:report/:entity/:id", function(req, res){
  //request.get({url:'http://localhost:3000/sysprint/'+req.params.report+'/'+req.params.entity+'/'+req.params.id, timeout:5000}, function(err, resp, body){
    //htmltopdf("<h1>TEST</h1>", { pageSize: 'letter', output: __dirname+'/public/temp/'+req.user._id+'.pdf' });
    //res.json({file:'/print/'+req.user._id+'.pdf'});
  //});
  //htmltopdf('http://localhost:3000/sysprint/'+req.params.report+'/'+req.params.entity+'/'+req.params.id, { pageSize: 'letter', output: __dirname+'/public/temp/'+req.user._id+'.pdf' });
  //htmltopdf(req.body.data, { pageSize: 'letter', output: __dirname+'/public/temp/'+req.user._id+'.pdf' });
  var options = {
    html: 'http://localhost:3000/sysprint/'+req.params.report+'/'+req.params.entity+'/'+req.params.id
  };
  pdf.convert(options, function(result){
    result.toFile(__dirname+'/public/temp/'+req.user._id+'.pdf');
    res.json({file:'/print/'+req.user._id+'.pdf'});
  });
});

app.post("/print", function(req, res){
  var html = req.body.data;
  console.log(req.body);
  request.get({url:'http://localhost:3000/css/main.css'}, function(err, resp, body){
    if(err){
      console.log(err);
    }
    html = "<style>"+body+"</style>" + html;
    htmltopdf(html, { pageSize: 'letter', output: __dirname+'/public/temp/'+req.user._id+'.pdf' }, function(){
      res.json({file:'/print/'+req.user._id+'.pdf'});
    });
});
});

//load the routes
app.use("/system", systemRoutes);
app.use("/api", apiRoutes);
app.use("/attachments", attachmentRoutes);
app.use("/auth", authRoutes);

app.listen(3000);
console.log("server listening on 3000");
