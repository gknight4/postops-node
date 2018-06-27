var express = require('express');
var app = express();
//var db = require('./db');
global.__root   = __dirname + '/'; 
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/users-db2', { }); // useMongoClient: true 

app.use(bodyParser.json());

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var OpenController = require(__root + 'controllers/OpenController');
app.use ('/open', OpenController);

var AuthController = require(__root + 'controllers/AuthController');
app.use ('/auth', AuthController);

module.exports = app;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});