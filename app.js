// Modules
var express = require('express'); //include the express js framework
var http = require('http');
var socketio = require('socket.io');
var redis = require('redis');
var path = require('path');

// Middleware - have access to request and response objects
var bodyParser = require('body-parser');

// Server Constants
var APP_PORT = 8001; //the port in which the application will run
var IO_PORT = 8000; //the port in which socket io will run
var REDIS_PORT = 6379;
var STATIC_ROOT = path.join(__dirname, 'public');
var VIEWS_ROOT = path.join(__dirname, 'views');

// Initialize
var app = express(); // create an app using express js
var server = http.createServer(app); // create the web server
var io = socketio(server);
var redisClient = redis.createClient(REDIS_PORT); //create a redis client

// App
var REDIS_USERS = 'users';
var REDIS_MESSAGES = 'messages';
var userCount = 0;
//var users = [];
var messages = [];
var errors = [
  {code: 'ERR_USERNAME_EXISTS', message: 'The given username is already in use.'}
];

function buildSuccessRes(data) {
  return {data: data};
}

function buildErrorRes(code, message) {
  return {error: {code: code, message: message}};
}

io.on('connection', function(socket ){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


app.use(bodyParser.urlencoded({
  extended: true
})); // use body-parser middleware to parse request body
app.use(express.static('public')); // declare 'public' dir as the dir that will serve up static files

// API Routes

app.get('/', function(req, res){
  res.sendFile('index.html', {root : VIEWS_ROOT});
  console.log(req.param('stuff'));
});

// POST - /users - create a new user
app.post('/users', function (req, res) {
  var username = req.body.username;
  var users = redisClient.smembers(REDIS_USERS);

  if (users.indexOf(username === -1)) {
    //users.push(username);
    redisClient.sadd(REDIS_USERS, username);
    res.send(buildSuccessRes({username: username}));
  } else {
    res.send(buildErrorRes(errors[0][code], errors[0][message]));
  }
});

// GET - /users - get all existing users
app.get('/users', function(req, res) {
  res.send(buildSucessRes({users: redisClient.smembers(REDIS_USERS)}));
});

// DELETE - /users/username
app.delete('/users/:username', function (req, res) {
  var username = req.params.username;
  //users.splice(users.indexOf(username), 1); 
  redisClient.srem(username);
});

// POST - /messages - create a new message
app.post('/messages', function (req, res) {
  //var username = req.body.username;
  var message = req.body.message;
  redisClient.lpush(REDIS_MESSAGES, message);
  res.send(buildSuccessRes({message: message}));
});

// GET - /messages - get all messages
app.get('/messages', function (req, res) {
  redisClient.lrange(REDIS_MESSAGES, 0, -1, function(err, results) {
    messages = results;
    res.send(buildSuccessRes({messages: messages}));
  });
});

server.listen(APP_PORT);

