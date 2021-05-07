import getRandomInt from './helper/getRandomInt';

export default class QuestionFactory {
	constructor(top50) {
		this.top50 = top50;
	}

	static randomQuestion(players) {
		let questions = [IdentifyFavoriteSong, IdentifyFavoriteArtist];
		if (players.length >= 4) {
			questions.concat([IdentifyPlayerFromSong, IdentifyPlayerFromArtist]);
		}
		let question = _getRandomArrEl(questions);
		let option = _getRandomArrEl(['recent', 'allTime']);
		return question(players, option);
	}

	static IdentifyFavoriteSong(players, option) {
		let songs = _getRandomSongs(players, option);

		let preview = _getRandomArrEl(songs).preview;

		songs = songs.map(song => _songToString(song));
		let player = players.filter(player => player.likesAnySong(songs))[0];

		return {
			question: `What is one of ${player.name}'s ${option} Top 10 songs?`,
			choices: songs,
			answers: songs.filter(song => player.likesSong(song)),
			song: preview,
			img: player.img
		};
	}

	static IdentifyFavoriteArtist(players, option) {
		let artists = _getRandomArtists(players, option);

		let artist = _getRandomArrEl(artists);
		let preview = _getRandomArrEl(artist.songs).preivew

		artists = artists.map(artist => artist.name);
		let player = players.filter(player => player.likesAnyArtist(artists))[0];

		return {
			question: `What is one of ${player.name}'s ${option} Top 10 artists?`,
			choices: artists,
			answers: artists.filter(artist => player.likesArtist(artists)),
			song: preview,
			img: player.img
		};
	}

	static _getRandomSongs(players, option) {
		const filterArr = (songArr, newSong) => {
			songArr = songArr.map(s => _songToString(s));
			newSong = _songToString(newSong);
			if (songArr.includes(newSong)) {
				return songArr;
			} else {
				return songArr.concat([newSong]);
			}
		}

		let songs = [];
		while (songs.length < 4) {
			let song;
			if (songs.length < players.length) {
				let player = _getRandomArrEl(players);
				song = player.pickRandomSong(option);
			} else {
				song = _getRandomArrEl(this.top50.songs);
			}
			songs = filterArr(songs, song)
			
		}

		return _shuffle(songs);
	}

	static _getRandomArtists(players, option) {
		const filterArr = (artistArr, newArtist) => {
			artistArr = artistArr.map(a => a.name);
			newArtist = newArtist.name;
			if (artistArrt.includes(newArtist)) {
				return artistArr;
			} else {
				return artistArr.concat([newArtist]);
			}
		}

		let artists = [];
		while (artists.length < 4) {
			let artist;
			if (artists.length < players.length) {
				let player = _getRandomArrEl(players);
				artist = player.pickRandomArtist(option);
			} else {
				artist = _getRandomArrEl(this.top50.artists);
			}
			artists = filterArr(artists, artist);
		}

		return _shuffle(artists);
	}

	static _getRandomArrEl(arr) {
		return arr[getRandomInt(arr.length)];
	}

	static _shuffle(array) {
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

	static _songToString(song) {
		return song.title + ' by ' + song.artists;
	}
}