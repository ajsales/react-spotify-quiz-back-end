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
var client = process.env.NODE_ENV === 'production' ? "https://react-spotify-quiz.herokuapp.com" : "http://localhost:3000";

var io = require('socket.io')(server, {
  cors: {
    origin: client,
    methods: ["GET", "POST"]
  }
});

var players = {};
var games = {};
var top50 = {};
var callbackNamespace = io.of('/callback');
var roomsNamespace = io.of('/rooms');
var gameNamespaces = io.of(/^\/game\/\w{6}$/);
callbackNamespace.on('connection', function (socket) {
  socket.on('newPlayer', function (playerData, extraData, callback) {
    var player = new _Player["default"](playerData);
    players[player.id] = player;
    top50 = extraData;
    console.log('A new player connected:', player.name);
    callback();
  });
});
roomsNamespace.on('connection', function (socket) {
  var rooms = Object.keys(games);
  socket.emit('availableRooms', rooms);
  console.log(socket.id, 'requesting rooms.');
  socket.on('newRoom', function (playerId, callback) {
    var host = players[playerId];
    var game = new _Game["default"](host, top50);
    games[game.id] = game;
    callback(game.id);
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
    console.log('Question request received!');
  });
});
server.listen(process.env.PORT || 8081, function () {
  console.log("Listening on ".concat(server.address().port));
});