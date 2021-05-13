/**
 * Initalizes Socket.io server.
 */

// Sets up Express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Headers needed for CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "https://react-spotify-quiz.herokuapp.com");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Sets up origin (i.e. where Socket.io client is located)
const client = process.env.NODE_ENV === 'production'
	? "https://react-spotify-quiz.herokuapp.com"
	: "http://localhost:3000";

// Starts Socket.io server.
const io = require('socket.io')(server, {
	cors: {
		origin: client,
		methods: ["GET", "POST"]
	}
});

// Helper classes for game/player
import Game from './game/Game';
import Player from './game/Player';

/**
 * Dictionary of all players in server.
 *
 * @typedef {Object.<string, Player>} players
 * @property {Player} playerId Instance of the player
 */
let players = {};

/**
 * Dictionary mapping each socket ID to their corresponding player ID.
 *
 * @typedef {Object.<string, string>} socketToPlayer
 * @property {Player} socketId The corresponding player ID
 */
let socketToPlayer = {};

/**
 * Dictionary of all games in server.
 *
 * @typedef {Object.<string, Game>} games
 * @property {Game} gameId Instance of the game
 */
let games = {};

/**
 * Extra Top 50 data to be placed in each game.
 *
 * @typedef {Object} top50
 * @property {Object[]} songs Songs in the Top 50 - USA playlist
 * @property {Object[]} artists Artists of the above songs
 */
let top50 = {};

// Initializes the different server-side namespaces
const callbackNamespace = io.of('/callback');
const roomsNamespace = io.of('/rooms');
const gameNamespaces = io.of(/^\/game\/\w{6}$/); // Matches all game URLs

// Namespace to deal with callback page
callbackNamespace.on('connection', (socket) => {

	// Creates new Player instance and stores it into dictionary
	// Also updates extra Top 50 data
	socket.on('newPlayer', (playerData, extraData, callback) => {
  		const player = new Player(playerData);
  		players[player.id] = player;
  		top50 = extraData;
  		callback();
  		console.log('A new player connected:', player.name);
  	});
});

// Namespace to deal with rooms page
roomsNamespace.on('connection', (socket) => {

	// Sends available rooms to sockets
	const rooms = Object.keys(games);
	socket.emit('availableRooms', rooms);
	console.log(socket.id, 'requesting rooms.');

	// Creates new room (i.e. Game instance) and stores it into dictionary
	socket.on('newRoom', (playerId, callback) => {
  		const host = players[playerId];
  		const game = new Game(host, top50);
  		games[game.id] = game;
  		callback(game.id);
  		console.log('New game started:', game.id);
  	});
});

// Namespaces to deal with game page
// (Each individual game has their respective namespace)
gameNamespaces.on('connection', (socket) => {

	// Gets specific game
	const namespace = socket.nsp;
	const gameId = namespace.name.substring(6);
	const game = games[gameId];

	const sendNewQuestion = () => {
		if (game.pastQuestions.length < 10) {
			const question = game.question();
			namespace.emit('newQuestion', question);
			namespace.emit('playSong', question.song);
			namespace.emit('startTimer');
		} else {
			endGame();
		}
	};

	const endGame = () => {
		namespace.emit('endGame');
	}

	socket.on('joinGame', (playerId, callback) => {
		const player = players[playerId];
		game.addPlayer(player);
		namespace.emit('currentPlayers', game.currentPlayers);
		callback();

		socketToPlayer[socket.id] = playerId;
		console.log('A new player joined:', player.name);
	});

	socket.on('disconnecting', () => {
		const playerId = socketToPlayer[socket.id];
		const player = players[playerId];
		game.removePlayer(player);
		namespace.emit('currentPlayers', game.currentPlayers);
		console.log('A player left:', player.name);

		if (game.isEveryoneFinished()) {
			sendNewQuestion();
		}
	});

	socket.on('startGame', () => {
		game.reset();
		sendNewQuestion();
		console.log('Game starting!');
	});

	socket.on('answeredQuestion', (correct, timer, choice) => {
		const playerId = socketToPlayer[socket.id];
		const player = players[playerId];
		game.answerQuestion(player, correct, timer, choice);
		namespace.emit('currentPlayers', game.currentPlayers);

		if (game.isEveryoneFinished()) {
			console.log('people should be finished!!')
			sendNewQuestion();
		}
	});
});


server.listen(process.env.PORT || 8081, () => {
	console.log(`Listening on ${server.address().port}`);
})
