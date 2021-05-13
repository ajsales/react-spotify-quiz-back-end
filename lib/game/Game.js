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
		this.answered = {};
		this.pastQuestions = [];
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

		if (!(newPlayer.name in this.points)) {
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
		if (oldPlayer.name in this.answered) {
			delete this.answered[oldPlayer.name];
		}
	}

	/**
	 * Returns a random question.
	 */
	question() {
		let { questionObj, pointCalculator } = this.questionFactory(this.players);
		while (askedAlready(questionObj, this.pastQuestions)) {
			let { questionObj, pointCalculator } = this.questionFactory(this.players);
		}

		this.pointCalculator = pointCalculator;

		for (let player of this.players) {
			this.answered[player.name] = false;
		}

		this.pastQuestions.push(questionObj);
		return questionObj;
	}

	answerQuestion(player, correct, timer) {
		this.answered[player.name] = true;
		if (correct) {
			this.points[player.name] += this.pointCalculator(player, timer);
		}
	}

	isEveryoneFinished() {
		for (let player in this.answered) {
			if (!this.answered[player]) {
				return false;
			}
		}
		return true;
	}

	reset() {
		for (let player in this.points) {
			this.points[player] = 0;
		}
		this.pastQuestions = [];
	}
}

const askedAlready = (question, questionList) => {
	for (let pastQuestion of questionList) {
		if (areQuestionsEqual(question, pastQuestion)) {
			return true;
		}
	}
	return false;
};

const areQuestionsEqual = (q1, q2) => {
	return q1.question === q2.question
		&& areArraysEqual(q1.choices, q2.choices);
};

const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let a of arr1) if (!arr2.includes(a)) return false;
    return true;
}