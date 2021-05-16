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
 * Dictionary mapping each socket ID to their corresponding player ID.
 *
 * @typedef {Object.<string, string>} socketToPlayer
 * @property {Player} socketId The corresponding player ID
 */

var socketToPlayer = {};
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

    if (host === undefined) {
      socket.emit('redirectToHome');
    }

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

  if (game === undefined) {
    socket.emit('redirectToRooms');
  }

  var sendNewQuestion = function sendNewQuestion() {
    if (game.pastQuestions.length < 5) {
      var question = game.question();
      namespace.emit('newQuestion', question);
      namespace.emit('playSong', question.song);
      namespace.emit('startTimer');
    } else {
      endGame();
    }
  };

  var resetGame = function resetGame() {
    game.reset();
    namespace.emit('currentPlayers', game.currentPlayers, game.host);
  };

  var endGame = function endGame() {
    namespace.emit('endGame');
  };

  socket.on('joinGame', function (playerId, callback) {
    if (game === undefined) {
      return;
    }

    var player = players[playerId];

    if (player === undefined) {
      callback('You must re-login!');
      return;
    }

    game.addPlayer(player);
    callback(game.pastQuestions.length > 0);
    namespace.emit('currentPlayers', game.currentPlayers, game.host);
    socketToPlayer[socket.id] = playerId;
    console.log('A new player joined:', player.name);
  });
  socket.on('disconnecting', function () {
    var playerId = socketToPlayer[socket.id];

    if (playerId === undefined) {
      return;
    }

    var player = players[playerId];

    if (player === undefined) {
      return;
    }

    game.removePlayer(player);

    if (game.players.length === 0) {
      return;
    }

    namespace.emit('currentPlayers', game.currentPlayers, game.host);
    console.log('A player left:', player.name);

    if (game.isEveryoneFinished()) {
      sendNewQuestion();
    }
  });
  socket.on('startGame', function () {
    resetGame();
    sendNewQuestion();
    console.log('Game starting!');
  });
  socket.on('answeredQuestion', function (correct, timer, choice) {
    var playerId = socketToPlayer[socket.id];
    var player = players[playerId];
    game.answerQuestion(player, correct, timer, choice);
    namespace.emit('currentPlayers', game.currentPlayers, game.host);

    if (game.isEveryoneFinished()) {
      sendNewQuestion();
    }
  });
});
server.listen(process.env.PORT || 8081, function () {
  console.log("Listening on ".concat(server.address().port));
});