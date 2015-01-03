// Modules
var express = require('express'); //include the express js framework
var http = require('http');
var socketio = require('socket.io');
var redis = require('redis');
var path = require('path');

// Middleware - have access to request and response objects
var bodyParser = require('body-parser');

// Constants
var APP_PORT = 8001; //the port in which the application will run
var IO_PORT = 8000; //the port in which socket io will run
var STATIC_ROOT = path.join(__dirname, 'public');
var VIEWS_ROOT = path.join(__dirname, 'views');

// Initialize
var app = express(); // create an app using express js
var server = http.createServer(app); //create an express js server
var io = socketio.listen(server); //start socket io
var redisClient = redis.createClient(); //create a redis client

app.use(bodyParser.urlencoded({
  extended: true
})); // use body-parser middleware to parse request body
app.use(express.static('public')); // declare 'public' dir as the dir that will serve up static files

app.get('/', function(req, res){
  res.sendFile('index.html', {root : VIEWS_ROOT});
  console.log(req.param('stuff'));
});



app.listen(APP_PORT);

