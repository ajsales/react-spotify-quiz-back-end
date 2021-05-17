/**
 * Represents a player instance.
 *
 * @typedef {Object} Player
 * @property {string} name Player's name
 * @property {string} id Player's Spotify ID
 * @property {string} img URL of player's profile image
 * @property {Object} songs Player's Top 10 songs (recent and all-time)
 * @property {Object} artists Player's Top 10 artists (recent and all-time)
 */

import getRandomInt from './helper/getRandomInt';

export default class Player {
	constructor(playerData) {
		this.name = playerData.name;
		this.id = playerData.id;
		this.img = playerData.img;
		this.songs = playerData.songs;
		this.artists = playerData.artists;
	}

	/**
	 * Returns random song from given list.
	 * 
	 * @param {string} option The given song list 
	 */
	pickRandomSong(option) {
		const index = getRandomInt(10);
		return this.songs[option][index];
	}

	/**
	 * Returns random artist from given list.
	 * 
	 * @param {string} option The given artist list 
	 */
	pickRandomArtist(option) {
		const index = getRandomInt(10);
		return this.artists[option][index];
	}

	/**
	 * Returns true if player has song in their Top 10 lists
	 * 
	 * @param {string} song The song to be checked 
	 */
	likesSong(song, option) {
		const songs = this.songs[option];
		return songs.map(s => s.toString).includes(song);
	}

	/**
	 * Returns true if player has any of the songs in their Top 10 lists
	 * 
	 * @param {string[]} songs The songs to be checked 
	 */
	likesAnySong(songs, option) {
		for songs.some(song => {
			return this.likesSong(song, option);
		});
	}

	/**
	 * Returns true if player has artist in their Top 10 lists
	 * 
	 * @param {string} artist The artist to be checked 
	 */
	likesArtist(artist, option) {
		const artists = this.artists[option];
		return artists.map(a => a.name).includes(artist);
	}

	/**
	 * Returns true if player has any of the artists in their Top 10 lists
	 * 
	 * @param {string[]} artists The artists to be checked 
	 */
	likesAnyArtist(artists, option) {
		return artists.some(artist => {
			return this.likesArtist(artist, option);
		});
	}
}