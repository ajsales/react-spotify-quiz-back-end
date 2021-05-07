"use strict";

var _Game = _interopRequireDefault(require("./classes/Game"));

var _Player = _interopRequireDefault(require("./classes/Player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var app = express();

var server = require('http').createServer(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://react-spotify-quiz.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var client = process.env.NODE_ENV === 'production' ? "http://react-spotify-quiz.herokuapp.com" : "http://localhost:3000";

var io = require('socket.io')(server, {
  cors: {
    origin: client,
    methods: ["GET", "POST"],
    credentials: true
  }
});

var players = {};
var games = {};
var top50 = {};
var gameNamespaces = io.of(/^\/game\/\w{6}$/);
io.on('connection', function (socket) {
  console.log('A user connected.');
  socket.on('disconnect', function () {
    console.log('A user disconnected.');
  });
  socket.on('newPlayer', function (playerData) {
    var player = new _Player["default"](playerData);
    players[player.id] = player;
    console.log('A new player connected:', player.name);
  });
  socket.on('extraData', function (data) {
    top50 = data;
  });
  socket.on('roomsRequest', function () {
    var rooms = Object.keys(games);
    socket.emit('availableRooms', rooms);
    console.log(socket.id, 'requesting rooms.');
  });
  socket.on('newRoom', function (playerId) {
    var host = players[playerId];
    var game = new _Game["default"](host, top50);
    games[game.id] = game;
    socket.emit('joinGame', game.id);
    console.log('New game started:', game.id);
  });
});
gameNamespaces.on('connection', function (socket) {
  var namespace = socket.nsp;
  var gameId = namespace.name.substring(6);
  console.log('Someone connected to Game', gameId);
  socket.on('questionRequest', function () {
    var game = games[gameId];
    socket.emit('newQuestion', game.question());
  });
});
server.listen(process.env.PORT || 8081, function () {
  console.log("Listening on ".concat(server.address().port));
});