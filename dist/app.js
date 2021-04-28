"use strict";

var _Game = _interopRequireDefault(require("./classes/Game"));

var _Player = _interopRequireDefault(require("./classes/Player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

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