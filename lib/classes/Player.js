import getRandomInt from './helper/getRandomInt';

export default class Player {
	constructor(playerData) {
		this.name = playerData.name;
		this.image = playerData.image;
		this.songs = playerData.songs;
		this.artists = playerData.artists;
	}

	pickRandomSong(option) {
		const index = getRandomInt(10);
		return this.songs[option][index];
	}

	get randomRecentSong() {
		return this.pickRandomSong('recent');
	}

	get randomAllTimeSong() {
		return this.pickRandomSong('allTime');
	}

	pickRandomArtist(option) {
		const index = getRandomInt(10);
		return this.artists[option][index];
	}

	get randomRecentArtist() {
		return this.pickRandomArtist('recent');
	}

	get randomAllTimeArtist() {
		return this.pickRandomArtist('allTime');
	}

	likesSong(song) {
		const allSongs = this.songs['recent'].concat(this.songs['allTime']);
		return allSongs.map(s => s.name).includes(song);
	}

	likesArtist(artist) {
		const allArtists = this.artists['recent'].concat(this.songs['allTime']);
		return allArtists.map(a => a.name).includes(artist);
	}
}