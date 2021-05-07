"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getRandomInt = _interopRequireDefault(require("./helper/getRandomInt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
        return s.title + ' by ' + s.artists;
      }).includes(song);
    }
  }, {
    key: "likesAnySong",
    value: function likesAnySong(songs) {
      var _iterator = _createForOfIteratorHelper(songs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var song = _step.value;

          if (this.likesSong(song)) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return false;
    }
  }, {
    key: "likesArtist",
    value: function likesArtist(artist) {
      var allArtists = this.artists['recent'].concat(this.songs['allTime']);
      return allArtists.map(function (a) {
        return a.name;
      }).includes(artist);
    }
  }, {
    key: "likesAnyArtist",
    value: function likesAnyArtist(artists) {
      var _iterator2 = _createForOfIteratorHelper(artists),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var artist = _step2.value;

          if (this.likesArtist(artist)) {
            return true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return false;
    }
  }]);

  return Player;
}();

exports["default"] = Player;