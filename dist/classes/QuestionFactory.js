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

var QuestionFactory = /*#__PURE__*/function () {
  function QuestionFactory(top50) {
    _classCallCheck(this, QuestionFactory);

    this.top50 = top50;
  }

  _createClass(QuestionFactory, null, [{
    key: "randomQuestion",
    value: function randomQuestion(players) {
      var questions = [IdentifyFavoriteSong, IdentifyFavoriteArtist];

      if (players.length >= 4) {
        questions.concat([IdentifyPlayerFromSong, IdentifyPlayerFromArtist]);
      }

      var question = _getRandomArrEl(questions);

      var option = _getRandomArrEl(['recent', 'allTime']);

      return question(players, option);
    }
  }, {
    key: "IdentifyFavoriteSong",
    value: function IdentifyFavoriteSong(players, option) {
      var songs = _getRandomSongs(players, option);

      var preview = _getRandomArrEl(songs).preview;

      songs = songs.map(function (song) {
        return _songToString(song);
      });
      var player = players.filter(function (player) {
        return player.likesAnySong(songs);
      })[0];
      return {
        question: "What is one of ".concat(player.name, "'s ").concat(option, " Top 10 songs?"),
        choices: songs,
        answers: songs.filter(function (song) {
          return player.likesSong(song);
        }),
        song: preview,
        img: player.img
      };
    }
  }, {
    key: "IdentifyFavoriteArtist",
    value: function IdentifyFavoriteArtist(players, option) {
      var artists = _getRandomArtists(players, option);

      var artist = _getRandomArrEl(artists);

      var preview = _getRandomArrEl(artist.songs).preivew;

      artists = artists.map(function (artist) {
        return artist.name;
      });
      var player = players.filter(function (player) {
        return player.likesAnyArtist(artists);
      })[0];
      return {
        question: "What is one of ".concat(player.name, "'s ").concat(option, " Top 10 artists?"),
        choices: artists,
        answers: artists.filter(function (artist) {
          return player.likesArtist(artists);
        }),
        song: preview,
        img: player.img
      };
    }
  }, {
    key: "_getRandomSongs",
    value: function _getRandomSongs(players, option) {
      var filterArr = function filterArr(songArr, newSong) {
        songArr = songArr.map(function (s) {
          return _songToString(s);
        });
        newSong = _songToString(newSong);

        if (songArr.includes(newSong)) {
          return songArr;
        } else {
          return songArr.concat([newSong]);
        }
      };

      var songs = [];

      while (songs.length < 4) {
        var song = void 0;

        if (songs.length < players.length) {
          var player = _getRandomArrEl(players);

          song = player.pickRandomSong(option);
        } else {
          song = _getRandomArrEl(this.top50.songs);
        }

        songs = filterArr(songs, song);
      }

      return _shuffle(songs);
    }
  }, {
    key: "_getRandomArtists",
    value: function _getRandomArtists(players, option) {
      var filterArr = function filterArr(artistArr, newArtist) {
        artistArr = artistArr.map(function (a) {
          return a.name;
        });
        newArtist = newArtist.name;

        if (artistArrt.includes(newArtist)) {
          return artistArr;
        } else {
          return artistArr.concat([newArtist]);
        }
      };

      var artists = [];

      while (artists.length < 4) {
        var artist = void 0;

        if (artists.length < players.length) {
          var player = _getRandomArrEl(players);

          artist = player.pickRandomArtist(option);
        } else {
          artist = _getRandomArrEl(this.top50.artists);
        }

        artists = filterArr(artists, artist);
      }

      return _shuffle(artists);
    }
  }, {
    key: "_getRandomArrEl",
    value: function _getRandomArrEl(arr) {
      return arr[(0, _getRandomInt["default"])(arr.length)];
    }
  }, {
    key: "_shuffle",
    value: function _shuffle(array) {
      var currentIndex = array.length,
          temporaryValue,
          randomIndex; // While there remain elements to shuffle...

      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1; // And swap it with the current element.

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  }, {
    key: "_songToString",
    value: function _songToString(song) {
      return song.title + ' by ' + song.artists;
    }
  }]);

  return QuestionFactory;
}();

exports["default"] = QuestionFactory;