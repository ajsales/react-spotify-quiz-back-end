import getRandomString from './helper/getRandomString';

export default class Game {
	constructor(host) {
		this.host = host.name;
		this.players = [host];
		this.points = { [host.name]: 0 };
		this.id = getRandomString(6);
	}

	addPlayer(newPlayer) {
		this.players = [...players, player];
	}

	removePlayer(oldPlayer) {
		this.players = this.players.filter(player => player != oldPlayer);
	}
}