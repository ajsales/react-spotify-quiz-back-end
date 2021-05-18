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
    var host = players[playerId]; // Server message for player to redirect to Home page
    // if server doesn't havetheir data

    if (host === undefined) {
      socket.emit('redirectToHome');
    }

    var game = new _Game["default"](host, top50);
    games[game.id] = game; // Callback for player to redirect to Game page

    callback(game.id);
    console.log('New game started:', game.id); // Sends updated available room list to players
    // currently on Rooms page

    rooms = Object.keys(games);
    socket.broadcast.emit('availableRooms');
  });
}); // Namespaces to deal with game page
// (Each individual game has their respective namespace)

gameNamespaces.on('connection', function (socket) {
  // Gets specific game
  var namespace = socket.nsp;
  var gameId = namespace.name.substring(6);
  var game = games[gameId]; // Server message for player to redirect
  // if game doesn't exist

  if (game === undefined) {
    socket.emit('redirectToRooms');
  } // Sends new question


  var sendNewQuestion = function sendNewQuestion() {
    // Ends game if 15 questions have already been sent
    if (game.pastQuestions.length < 15) {
      var question = game.question();
      namespace.emit('newQuestion', question);
    } else {
      endGame();
    }
  }; // Resets game if playing again


  var resetGame = function resetGame() {
    game.reset(); // Sends players again with zero-ed out points

    namespace.emit('currentPlayers', game.currentPlayers, game.host);
  }; // Server message for players to end game


  var endGame = function endGame() {
    namespace.emit('endGame');
  }; // Adds new player to game


  socket.on('joinGame', function (playerId, callback) {
    // Server message for player to redirect
    // if game doesn't exist
    if (game === undefined) {
      socket.emit('redirectToRooms');
      return;
    } // Server message for player to redirect
    // if it doesn't have their data


    var player = players[playerId];

    if (player === undefined) {
      callback('You must re-login!');
      return;
    }

    game.addPlayer(player); // Callback to tell player if game already started

    callback(game.pastQuestions.length > 0); // Sends updated players and host to everyone
    // currently in the game

    namespace.emit('currentPlayers', game.currentPlayers, game.host);
    socketToPlayer[socket.id] = playerId;
    console.log('A new player joined:', player.name);
  }); // Removes disconnecting players

  socket.on('disconnecting', function () {
    // Grabs player from socket-to-player dictionary
    // as it wouldn't know who was disconnecting otherwise
    var playerId = socketToPlayer[socket.id];

    if (playerId === undefined) {
      return;
    } // Checks to see if player data exists


    var player = players[playerId];

    if (player === undefined) {
      return;
    } // Removes player and updates host if disconnecting
    // player was the host


    game.removePlayer(player); // CHecks to see if last player in game

    if (game.players.length === 0) {
      return;
    } // Sends updated players to all players still
    // in the game


    namespace.emit('currentPlayers', game.currentPlayers, game.host);
    console.log('A player left:', player.name); // Checks to see if disconnecting player
    // was last person to not have answered question
    // so that game can proceed

    if (game.isEveryoneFinished()) {
      sendNewQuestion();
    }
  }); // Starts game

  socket.on('startGame', function () {
    // Resets game if playing again
    resetGame();
    sendNewQuestion();
    console.log('Game starting!');
  }); // Server response to a player answering the current question

  socket.on('answeredQuestion', function (correct, timer, choice) {
    var playerId = socketToPlayer[socket.id];
    var player = players[playerId]; // Adds points if player answered correctly

    game.answerQuestion(player, correct, timer, choice); // Sends players with updated point totals

    namespace.emit('currentPlayers', game.currentPlayers, game.host); // Checks to see if player was last person to answer

    if (game.isEveryoneFinished()) {
      sendNewQuestion();
    }
  });
});
server.listen(process.env.PORT || 8081, function () {
  console.log("Listening on ".concat(server.address().port));
});