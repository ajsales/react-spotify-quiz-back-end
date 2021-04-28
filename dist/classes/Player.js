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
    this.image = playerData.image;
    this.songs = playerData.songs;
    this.artists = playerData.artists;
  }

  _createClass(Player, [{
    key: "pickRandomSong",
    value: function pickRandomSong(option) {
      var index = (0, _getRandomInt["default"])(10);
      return this.songs[option][index];
    }
  }, {
    key: "randomRecentSong",
    get: function get() {
      return this.pickRandomSong('recent');
    }
  }, {
    key: "randomAllTimeSong",
    get: function get() {
      return this.pickRandomSong('allTime');
    }
  }, {
    key: "pickRandomArtist",
    value: function pickRandomArtist(option) {
      var index = (0, _getRandomInt["default"])(10);
      return this.artists[option][index];
    }
  }, {
    key: "randomRecentArtist",
    get: function get() {
      return this.pickRandomArtist('recent');
    }
  }, {
    key: "randomAllTimeArtist",
    get: function get() {
      return this.pickRandomArtist('allTime');
    }
  }, {
    key: "likesSong",
    value: function likesSong(song) {
      var allSongs = this.songs['recent'].concat(this.songs['allTime']);
      return allSongs.map(function (s) {
        return s.name;
      }).includes(song);
    }
  }, {
    key: "likesArtist",
    value: function likesArtist(artist) {
      var allArtists = this.artists['recent'].concat(this.songs['allTime']);
      return allArtists.map(function (a) {
        return a.name;
      }).includes(artist);
    }
  }]);

  return Player;
}();

exports["default"] = Player;