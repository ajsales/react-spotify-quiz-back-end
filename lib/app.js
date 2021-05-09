const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "https://react-spotify-quiz.herokuapp.com");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const client = process.env.NODE_ENV === 'production'
					? "http://react-spotify-quiz.herokuapp.com"
					: "http://localhost:3000";
const io = require('socket.io')(server, {
	cors: {
		origin: client,
		methods: ["GET", "POST"],
		credentials: true
	}
});

import Game from './classes/Game';
import Player from './classes/Player';

let players = {};
let games = {};
let top50 = {};

const callbackNamespace = io.of('/callback');
const roomsNamespace = io.of('/rooms');
const gameNamespaces = io.of(/^\/game\/\w{6}$/);

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('newPlayer', (playerData, extraData, callback) => {
  		const player = new Player(playerData);
  		players[player.id] = player;
  		top50 = extraData;
  		console.log('A new player connected:', player.name);
  		callback();
  	});
})

roomsNamespace.on('connection', (socket) => {

	const rooms = Object.keys(games);
	socket.emit('availableRooms', rooms);
	console.log(socket.id, 'requesting rooms.');

	socket.on('newRoom', (playerId, callback) => {
  		const host = players[playerId];
  		const game = new Game(host, top50);
  		games[game.id] = game;
  		callback(game.id);
  		console.log('New game started:', game.id);
  	});
})

gameNamespaces.on('connection', (socket) => {
	const namespace = socket.nsp;
	const gameId = namespace.name.substring(6);
	console.log('Someone connected to Game', gameId);

	socket.on('questionRequest', () => {
		const game = games[gameId];
		socket.emit('newQuestion', game.question());
		console.log('Question request received!');
	});
})



server.listen(process.env.PORT || 8081, () => {
	console.log(`Listening on ${server.address().port}`);
})
