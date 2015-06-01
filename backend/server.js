var express = require('express'),
    app = express();
    passport = require('passport'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    busboy = require('connect-busboy');

app.use(busboy());

mongoose.connect('mongodb://localhost:27017/pe-portal');

//load the models
require(__dirname+'/server/models/users');
require(__dirname+'/server/models/partners');
require(__dirname+'/server/models/validations');
require(__dirname+'/server/models/steps');
require(__dirname+'/server/models/step-types');
require(__dirname+'/server/models/step-status');
require(__dirname+'/server/models/images');
require(__dirname+'/server/models/issues');

//configure passport strategies
require(__dirname+'/server/controllers/passport/passport')(passport);

//route controllers
var systemRoutes = require(__dirname+'/server/routes/system/system');
var apiRoutes = require(__dirname+'/server/routes/api/api');
var authRoutes = require(__dirname+'/server/routes/auth');

app.use('/views', express.static(__dirname + '/public/views'));
app.use('/templates', express.static(__dirname + '/public/templates'));
app.use('/css', express.static(__dirname + '/public/styles/css'));
app.use('/resources', express.static(__dirname + '/public/resources'));
app.use('/js', express.static(__dirname + '/public/scripts/build'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/qsocks', express.static(__dirname + '/node_modules/qsocks'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(expressSession({secret: 'qlikPEPortal'})); //ATTENTION - need to find out what the secret key is
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render(__dirname+'/server/views/index.jade', {isAuthenticated: req.isAuthenticated(), user: req.user});
});

//load the routes
app.use('/system', systemRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.listen(3000);
console.log('server listening on 3000');
