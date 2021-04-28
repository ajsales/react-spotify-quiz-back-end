const express = require('express');
const app = express();
const server = require('http').createServer(app);

const client = process.env.NODE_ENV === 'production'
					? "https://react-spotify-quiz.herokuapp.com"
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

let players = [];
let games = {};

io.on('connection', (socket) => {
  	console.log('a user connected');

  	socket.on('disconnect', () => {
    	console.log('user disconnected');
  	});

  	socket.on('player', (playerData) => {
  		const newPlayer = new Player(playerData);
  		players.push(newPlayer);
  	})

});

server.listen(process.env.PORT || 8081, () => {
	console.log(`Listening on ${server.address().port}`);
})
