"use strict";

var _Game = _interopRequireDefault(require("./classes/Game"));

var _Player = _interopRequireDefault(require("./classes/Player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var app = express();

var server = require('http').createServer(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://react-spotify-quiz.herokuapp.com"); // update to match the domain you will make the request from

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
console.log(process.env.NODE_ENV);
var client = process.env.NODE_ENV === 'production' ? "http://react-spotify-quiz.herokuapp.com" : "http://localhost:3000";

var io = require('socket.io')(server, {
  cors: {
    origin: client,
    methods: ["GET", "POST"],
    credentials: true
  }
});

var players = [];
var games = {};
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('player', function (playerData) {
    var newPlayer = new _Player["default"](playerData);
    players.push(newPlayer);
  });
});
server.listen(process.env.PORT || 8081, function () {
  console.log("Listening on ".concat(server.address().port));
});