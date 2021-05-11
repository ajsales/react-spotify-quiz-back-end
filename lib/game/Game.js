/**
 * Represents a game instance.
 *
 * @typedef {Object} Game
 * @property {string} host Name of the host of the game
 * @property {Player[]} players Array of the players playing in this game
 * @property {Object.<string, int>} points Dictionary of the players that points they have
 * @property {string} id ID of the game (random 6-character string)
 * @property {function} questionFactory Question-maker
 */

import getRandomString from './helper/getRandomString';
import questionFactory from './questionFactory';

export default class Game {
	constructor(host, top50) {
		this.host = host.name;
		this.players = [host];
		this.points = { [host.name]: 0 };
		this.id = getRandomString(6);
		this.questionFactory = questionFactory(top50);
	}

	get currentPlayers() {
		return this.players.map(player => {
			return {
				name: player.name,
				img: player.img,
				points: this.points[player.name]
			};
		})
	}

	/**
	 * Adds player to game's list of players
	 * 
	 * @param {Player} newPlayer The player to be added
	 */
	addPlayer(newPlayer) {
		if (!this.players.map(p => p.name).includes(newPlayer.name)) {
			this.players.push(newPlayer);
		}

		if (!Object.keys(this.points).includes(newPlayer.name)) {
			this.points[newPlayer.name] = 0;
		}
	}

	/**
	 * Removes player from game's list of player
	 * 
	 * @param {Player} oldPlayer The player to be removed
	 */
	removePlayer(oldPlayer) {
		this.players = this.players.filter(player => player.name !== oldPlayer.name);
	}

	/**
	 * Returns a random question.
	 */
	question() {
		const { questionObj, pointCalculator } = this.questionFactory(this.players);

		this.pointCalculator = pointCalculator;
		this.answered = {};
		for (let player in this.players) {
			this.answered[player.name] = false;
		}

		return questionObj;
	}

	answerQuestion(player, correct, timer) {
		this.answered[player.name] = true;
		if (correct) {
			this.points[player.name] += this.pointCalculator(player, timer);
		}
	}
}