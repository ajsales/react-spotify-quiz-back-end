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

	/**
	 * Adds player to game's list of players
	 * 
	 * @param {string} newPlayer The player to be added
	 */
	addPlayer(newPlayer) {
		this.players = [...players, player];
	}

	/**
	 * Removes player from game's list of player
	 * 
	 * @param {string} oldPlayer The player to be removed
	 */
	removePlayer(oldPlayer) {
		this.players = this.players.filter(player => player != oldPlayer);
	}

	/**
	 * Returns a random question.
	 */
	question() {
		return this.questionFactory(this.players);
	}
}