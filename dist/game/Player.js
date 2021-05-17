"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getRandomInt = _interopRequireDefault(require("./helper/getRandomInt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player = /*#__PURE__*/function () {
  function Player(playerData) {
    _classCallCheck(this, Player);

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


  _createClass(Player, [{
    key: "pickRandomSong",
    value: function pickRandomSong(option) {
      var songList = this.songs[option];
      var index = (0, _getRandomInt["default"])(songList.length);
      return songList[index];
    }
    /**
     * Returns random artist from given list.
     * 
     * @param {string} option The given artist list 
     */

  }, {
    key: "pickRandomArtist",
    value: function pickRandomArtist(option) {
      var artistList = this.artists[option];
      var index = (0, _getRandomInt["default"])(artistList.length);
      return artistList[index];
    }
    /**
     * Returns true if player has song in their Top 10 lists
     * 
     * @param {string} song The song to be checked 
     */

  }, {
    key: "likesSong",
    value: function likesSong(song, option) {
      var songs = this.songs[option];
      return songs.map(function (s) {
        return s.toString;
      }).includes(song);
    }
    /**
     * Returns true if player has any of the songs in their Top 10 lists
     * 
     * @param {string[]} songs The songs to be checked 
     */

  }, {
    key: "likesAnySong",
    value: function likesAnySong(songs, option) {
      var _this = this;

      return songs.some(function (song) {
        return _this.likesSong(song, option);
      });
    }
    /**
     * Returns true if player has artist in their Top 10 lists
     * 
     * @param {string} artist The artist to be checked 
     */

  }, {
    key: "likesArtist",
    value: function likesArtist(artist, option) {
      var artists = this.artists[option];
      return artists.map(function (a) {
        return a.name;
      }).includes(artist);
    }
    /**
     * Returns true if player has any of the artists in their Top 10 lists
     * 
     * @param {string[]} artists The artists to be checked 
     */

  }, {
    key: "likesAnyArtist",
    value: function likesAnyArtist(artists, option) {
      var _this2 = this;

      return artists.some(function (artist) {
        return _this2.likesArtist(artist, option);
      });
    }
  }]);

  return Player;
}();

exports["default"] = Player;