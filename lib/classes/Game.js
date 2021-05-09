import getRandomString from './helper/getRandomString';
import questionFactory from './QuestionFactory';

export default class Game {
	constructor(host, top50) {
		this.host = host.name;
		this.players = [host];
		this.points = { [host.name]: 0 };
		this.id = getRandomString(6);
		this.questionFactory = questionFactory(top50);
	}

	addPlayer(newPlayer) {
		this.players = [...players, player];
	}

	removePlayer(oldPlayer) {
		this.players = this.players.filter(player => player != oldPlayer);
	}

	question() {
		return this.questionFactory(this.players);
	}
}