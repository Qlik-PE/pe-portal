var express = require('express');
var app = express();

//routes
require(__dirname+'/server/routes/main')(app);

//public directories
app.use('/js', express.static(__dirname + '/public/scripts/build'));
app.use('/views', express.static(__dirname + '/public/views'));
app.use('/css', express.static(__dirname + '/public/styles/css'));
app.use('/resources', express.static(__dirname + '/public/resources'));
app.use('/templates', express.static(__dirname + '/public/views'));
app.use('/qsocks', express.static(__dirname + '/node_modules/qsocks'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.listen(3003);
