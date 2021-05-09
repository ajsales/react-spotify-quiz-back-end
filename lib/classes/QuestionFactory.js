import getRandomInt from './helper/getRandomInt';

export default function questionFactory(top50) {

	const randomQuestion = (players) => {
		let questions = [IdentifyFavoriteSong, IdentifyFavoriteArtist];
		if (players.length >= 4) {
			questions.concat([IdentifyPlayerFromSong, IdentifyPlayerFromArtist]);
		}
		let question = _getRandomArrEl(questions);
		let option = _getRandomArrEl(['recent', 'allTime']);
		return question(players, option);
	}

	const IdentifyFavoriteSong = (players, option) => {
		let songs = _getRandomSongs(players, option);

		let preview = _getRandomArrEl(songs).preview;

		songs = songs.map(song => song.toString);
		let player = players.filter(player => player.likesAnySong(songs))[0];
		if (option == 'allTime') option = 'all-time';

		return {
			question: `What is one of ${player.name}'s ${option} Top 10 songs?`,
			choices: songs,
			answers: songs.filter(song => player.likesSong(song)),
			song: preview,
			img: player.img
		};
	}

	const IdentifyFavoriteArtist = (players, option) => {
		let artists = _getRandomArtists(players, option);

		let artist = _getRandomArrEl(artists);
		let preview = _getRandomArrEl(artist.songs).preview;

		artists = artists.map(a => a.name);
		let player = players.filter(player => player.likesAnyArtist(artists))[0];
		if (option == 'allTime') option = 'all-time';

		return {
			question: `What is one of ${player.name}'s ${option} Top 10 artists?`,
			choices: artists,
			answers: artists.filter(a => player.likesArtist(a)),
			song: preview,
			img: player.img
		};
	}

	const _getRandomSongs = (players, option) => {
		let songs = [];
		while (songs.length < 4) {
			let song;
			if (songs.length < players.length) {
				let player = _getRandomArrEl(players);
				song = player.pickRandomSong(option);
			} else {
				song = _getRandomArrEl(top50.songs);
			}

			if (!songs.map(s => s.toString).includes(song.toString)) {
				songs.push(song);
			}
		}

		return _shuffle(songs);
	}

	const _getRandomArtists = (players, option) => {
		let artists = [];
		while (artists.length < 4) {
			let artist;
			if (artists.length < players.length) {
				let player = _getRandomArrEl(players);
				artist = player.pickRandomArtist(option);
			} else {
				artist = _getRandomArrEl(top50.artists);
			}

			if (!artists.map(a => a.name).includes(artist.name)) {
				artists.push(artist);
			}
		}

		return _shuffle(artists);
	}

	const _getRandomArrEl = (arr) => {
		return arr[getRandomInt(arr.length)];
	}

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