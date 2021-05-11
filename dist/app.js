"use strict";

var _Game = _interopRequireDefault(require("./game/Game"));

var _Player = _interopRequireDefault(require("./game/Player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Initalizes Socket.io server.
 */
// Sets up Express server
var express = require('express');

var app = express();

var server = require('http').createServer(app); // Headers needed for CORS


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://react-spotify-quiz.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); // Sets up origin (i.e. where Socket.io client is located)

var client = process.env.NODE_ENV === 'production' ? "https://react-spotify-quiz.herokuapp.com" : "http://localhost:3000"; // Starts Socket.io server.

var io = require('socket.io')(server, {
  cors: {
    origin: client,
    methods: ["GET", "POST"]
  }
}); // Helper classes for game/player


/**
 * Dictionary of all players in server.
 *
 * @typedef {Object.<string, Player>} players
 * @property {Player} playerId Instance of the player
 */
var players = {};
/**
 * Dictionary of all games in server.
 *
 * @typedef {Object.<string, Game>} games
 * @property {Game} gameId Instance of the game
 */

var games = {};
/**
 * Extra Top 50 data to be placed in each game.
 *
 * @typedef {Object} top50
 * @property {Object[]} songs Songs in the Top 50 - USA playlist
 * @property {Object[]} artists Artists of the above songs
 */

var top50 = {}; // Initializes the different server-side namespaces

var callbackNamespace = io.of('/callback');
var roomsNamespace = io.of('/rooms');
var gameNamespaces = io.of(/^\/game\/\w{6}$/); // Matches all game URLs
// Namespace to deal with callback page

callbackNamespace.on('connection', function (socket) {
  // Creates new Player instance and stores it into dictionary
  // Also updates extra Top 50 data
  socket.on('newPlayer', function (playerData, extraData, callback) {
    var player = new _Player["default"](playerData);
    players[player.id] = player;
    top50 = extraData;
    callback();
    console.log('A new player connected:', player.name);
  });
}); // Namespace to deal with rooms page

roomsNamespace.on('connection', function (socket) {
  // Sends available rooms to sockets
  var rooms = Object.keys(games);
  socket.emit('availableRooms', rooms);
  console.log(socket.id, 'requesting rooms.'); // Creates new room (i.e. Game instance) and stores it into dictionary

  socket.on('newRoom', function (playerId, callback) {
    var host = players[playerId];
    var game = new _Game["default"](host, top50);
    games[game.id] = game;
    callback(game.id);
    console.log('New game started:', game.id);
  });
}); // Namespaces to deal with game page
// (Each individual game has their respective namespace)

gameNamespaces.on('connection', function (socket) {
  // Gets specific game
  var namespace = socket.nsp;
  var gameId = namespace.name.substring(6);
  var game = games[gameId];
  console.log('Someone connected to Game', gameId);
  socket.on('joinGame', function (playerId) {
    var player = players[playerId];
    game.addPlayer(player);
    namespace.emit('currentPlayers', game.players);
    console.log('A new player joined:', player.name);
  }); // Sends question to game

  socket.on('questionRequest', function () {
    socket.emit('newQuestion', game.question());
    console.log('Question request received!');
  });
});
server.listen(process.env.PORT || 8081, function () {
  console.log("Listening on ".concat(server.address().port));
});