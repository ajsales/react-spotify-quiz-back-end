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
		this.host = host.id;
		this.players = [host];
		this.points = { [host.name]: 0 };
		this.id = getRandomString(6);
		this.questionFactory = questionFactory(top50);
		this.answered = {};
		this.pastQuestions = [];
	}

	/**
	 * Sends player array for front-end to display.
	 */
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
	 * Adds player to game's list of players.
	 * 
	 * @param {Player} newPlayer The player to be added
	 */
	addPlayer(newPlayer) {
		if (!this.players.map(p => p.name).includes(newPlayer.name)) {
			this.players.push(newPlayer);
		}

		// Initializes player in points array
		if (!(newPlayer.name in this.points)) {
			this.points[newPlayer.name] = 0;
		}
	}

	/**
	 * Removes player from game's list of players.
	 * 
	 * @param {Player} oldPlayer The player to be removed
	 */
	removePlayer(oldPlayer) {
		this.players = this.players.filter(player => player.name !== oldPlayer.name);
		if (this.players.length > 0) {
			if (this.host === oldPlayer.id) {
				this.host = this.players[0].id;
			}

			// Removes player from answered array so game
			// isn't frozen with removed player
			if (oldPlayer.name in this.answered) {
				delete this.answered[oldPlayer.name];
			}
		}
	}

	/**
	 * Returns a random question.
	 */
	question() {
		let { questionObj, pointCalculator } = this.questionFactory(this.players);

		// Checks to see if question has already been asked already
		while (askedAlready(questionObj, this.pastQuestions)) {
			let { questionObj, pointCalculator } = this.questionFactory(this.players);
		}

		// Sets current point calculator
		this.pointCalculator = pointCalculator;

		// Initalizes answered array to false
		for (let player of this.players) {
			this.answered[player.name] = false;
		}

		this.pastQuestions.push(questionObj);
		return questionObj;
	}

	/**
	 * Notes player answering a question and gives them points of correct.
	 * 
	 * @param {Player} player The player who answered
	 * @param {boolean} correct True, if player answered correctly
	 * @param {int} timer Time left when player answered
	 */
	answerQuestion(player, correct, timer) {
		this.answered[player.name] = true;
		if (correct) {
			this.points[player.name] += this.pointCalculator(player, timer);
		}
	}

	/**
	 * Returns true if everyone answered current question.
	 */
	isEveryoneFinished() {
		return Object.values(this.answered).every(value => value);
	}

	/**
	 * Resets game.
	 */
	reset() {
		for (let player in this.points) {
			this.points[player] = 0;
		}
		this.pastQuestions = [];
	}
}

// Helper function for if question has already been asked
const askedAlready = (question, questionList) => {
	return questionList.some(pastQuestion => {
		return areQuestionsEqual(question, pastQuestion);
	});
};

// Helper function for if two questions are equal
// (i.e. when question prompt is the same and the
// choices are the same)
const areQuestionsEqual = (q1, q2) => {
	return q1.question === q2.question
		&& areArraysEqual(q1.answers, q2.answers);
};

// Helper function for if two arrays are equal
const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let a of arr1) if (!arr2.includes(a)) return false;
    return true;
}