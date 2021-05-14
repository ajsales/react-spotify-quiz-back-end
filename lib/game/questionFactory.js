/**
 * Returns a function that generates questions
 *
 * @param {Object} top50 Extra Top 50 data to be added if not enough players
 */

import getRandomInt from './helper/getRandomInt';

export default function QuestionFactory(top50) {

	/**
	 * Returns a random question.
	 *
	 * @param {Player[]} players Array of the players in the game
	 */
	const randomQuestion = (players) => {

		// Restricts types of questions if there are less than 4 players
		let questions = [IdentifyFavoriteSong, IdentifyFavoriteArtist];
		if (players.length >= 4) {
			questions.concat([IdentifyPlayerFromSong, IdentifyPlayerFromArtist]);
		}

		let questionType = _getRandomArrEl(questions);
		let option = _getRandomArrEl(['recent', 'allTime']);

		return questionType(players, option);
	}

	/**
	 * Returns a question of the type:
	 * "What is one of Player 1's all-time Top 10 songs?"
	 *
	 * @param {Player[]} players Array of the players in the game
	 * @param {string} option The Top 10 lists to be used
	 */
	const IdentifyFavoriteSong = (players, option) => {
		let songs = _getRandomSongs(players, option);

		let preview = _getRandomArrEl(songs).preview;

		songs = songs.map(song => song.toString);
		players = players.filter(player => player.likesAnySong(songs));
		let player = _getRandomArrEl(players);

		const questionObj = {
			question: `What is one of ${player.name}'s ${option} Top 10 songs?`,
			choices: songs,
			answers: songs.filter(song => player.likesSong(song)),
			song: preview,
			img: player.img
		};

		const pointCalculator = (answerer, timer, choice) => {
			if (answerer.name === player.name) {
				return timer * 0.75 * 4;
			} else {
				return timer * 4;
			}
		}

		return {questionObj, pointCalculator};
	}

	/**
	 * Returns a question of the type:
	 * "What is one of Player 1's all-time Top 10 artists?"
	 *
	 * @param {Player[]} players Array of the players in the game
	 * @param {string} option The Top 10 lists to be used
	 */
	const IdentifyFavoriteArtist = (players, option) => {
		let artists = _getRandomArtists(players, option);

		let artist = _getRandomArrEl(artists);
		let preview = _getRandomArrEl(artist.songs).preview;

		artists = artists.map(a => a.name);
		players = players.filter(player => player.likesAnyArtist(artists));
		let player = _getRandomArrEl(players);

		const questionObj = {
			question: `What is one of ${player.name}'s ${option} Top 10 artists?`,
			choices: artists,
			answers: artists.filter(a => player.likesArtist(a)),
			song: preview,
			img: player.img
		}

		const pointCalculator = (answerer, timer, choice) => {
			if (answerer.name === player.name) {
				return timer * 0.75 * 4;
			} else {
				return timer * 4;
			}
		}

		return  {questionObj, pointCalculator};
	}

	const IdentifyPlayerFromSong = (players, option) => {
		let songs = _getRandomSongs(players, option);
		let song = _getRandomArrEl(songs);

		let answers = players.filter(player => player.likesSong(song));
		let choices = _getRandomPlayers(players, _getRandomArrEl(answers));

		const questionObj = {
			question: `Whose ${option} Top 10 song is ${song.toString}?`,
			choices: choices.map(player => player.name),
			answers: answers.map(player => player.name),
			song: song.preview,
			img: song.img
		}

		const pointCalculator = (answerer, timer, choice) => {
			if (answerer.name === choice) {
				return timer * 0.75 * 4;
			} else {
				return timer * 4;
			}
		}

		return  {questionObj, pointCalculator};
	}

	const IdentifyPlayerFromArtist = (players, option) => {
		let artists = _getRandomArtists(players, option);
		let artist = _getRandomArrEl(artists);

		let preview = _getRandomArrEl(artist.songs).preview;

		let answers = player.filter(player => player.likesArtist(artist));
		let choices = _getRandomPlayers(players, _getRandomArrEl(answers));

		const questionObj = {
			question: `Whose ${option} Top 10 artist is ${artist.name}?`,
			choices: choices.map(player => player.name),
			answers: answers.map(player => player.name),
			song: preview,
			img: artist.img
		}

		const pointCalculator = (answerer, timer, choice) => {
			if (answerer.name === choice) {
				return timer * 0.75 * 4;
			} else {
				return timer * 4;
			}
		}

		return  {questionObj, pointCalculator};
	}

	const _getRandomPlayers = (players, included) => {
		let result = [included];
		while (result.length < 4) {
			let curr = _getRandomArrEl(players);
			if (!result.map(p => p.name).includes(curr.name)) {
				result.push(curr);
			}
		}
		return _shuffle(result);
	}

	/**
	 * Helper function to grab random songs from list of players
	 *
	 * @param {Player[]} players Array of the players in the game
	 * @param {string} option The Top 10 lists to be used
	 */
	const _getRandomSongs = (players, option) => {
		let songs = [];
		while (songs.length < 4) {
			let song;

			// Grabs at least a player's favorite song for each player in the game
			// Once it exceeds that, it'll grab a song from the extra Top 50 data
			if (songs.length < players.length) {
				let player = _getRandomArrEl(players);
				song = player.pickRandomSong(option);
			} else {
				song = _getRandomArrEl(top50.songs);
			}

			// Doesn't add song if already in array
			if (!songs.map(s => s.toString).includes(song.toString)) {
				songs.push(song);
			}
		}

		return _shuffle(songs);
	}

	/**
	 * Helper function to grab random artists from list of players
	 *
	 * @param {Player[]} players Array of the players in the game
	 * @param {string} option The Top 10 lists to be used
	 */
	const _getRandomArtists = (players, option) => {
		let artists = [];
		while (artists.length < 4) {
			let artist;

			// Grabs at least a player's favorite artist for each player in the game
			// Once it exceeds that, it'll grab an artist from the extra Top 50 data
			if (artists.length < players.length) {
				let player = _getRandomArrEl(players);
				artist = player.pickRandomArtist(option);
			} else {
				artist = _getRandomArrEl(top50.artists);
			}

			// Doesn't add artist if already in array
			if (!artists.map(a => a.name).includes(artist.name)) {
				artists.push(artist);
			}
		}

		return _shuffle(artists);
	}

	/**
	 * Helper function to grab random element from array
	 *
	 * @param {[]} arr Array to be used
	 */
	const _getRandomArrEl = (arr) => {
		return arr[getRandomInt(arr.length)];
	}

	/**
	 * Helper function to shuffle array
	 *
	 * @param {[]} array Array to be used
	 */
	const _shuffle = (array) => {
	  	var currentIndex = array.length, temporaryValue, randomIndex;

	  	// While there remain elements to shuffle...
	  	while (0 !== currentIndex) {

	   		// Pick a remaining element...
	   	 	randomIndex = Math.floor(Math.random() * currentIndex);
	   	 	currentIndex -= 1;

	   	 	// And swap it with the current element.
	   	 	temporaryValue = array[currentIndex];
	   	 	array[currentIndex] = array[randomIndex];
	   	 	array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

	return randomQuestion;
}