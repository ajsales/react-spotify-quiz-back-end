"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = QuestionFactory;

var _getRandomInt = _interopRequireDefault(require("./helper/getRandomInt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function QuestionFactory(top50) {
  var randomQuestion = function randomQuestion(players) {
    var questions = [IdentifyFavoriteSong, IdentifyFavoriteArtist];

    if (players.length >= 4) {
      questions.concat([IdentifyPlayerFromSong, IdentifyPlayerFromArtist]);
    }

    var question = _getRandomArrEl(questions);

    var option = _getRandomArrEl(['recent', 'allTime']);

    return question(players, option);
  };

  var IdentifyFavoriteSong = function IdentifyFavoriteSong(players, option) {
    var songs = _getRandomSongs(players, option);

    var preview = _getRandomArrEl(songs).preview;

    songs = songs.map(function (song) {
      return song.toString;
    });
    var player = players.filter(function (player) {
      return player.likesAnySong(songs);
    })[0];
    if (option == 'allTime') option = 'all-time';
    return {
      question: "What is one of ".concat(player.name, "'s ").concat(option, " Top 10 songs?"),
      choices: songs,
      answers: songs.filter(function (song) {
        return player.likesSong(song);
      }),
      song: preview,
      img: player.img
    };
  };

  var IdentifyFavoriteArtist = function IdentifyFavoriteArtist(players, option) {
    var artists = _getRandomArtists(players, option);

    var artist = _getRandomArrEl(artists);

    var preview = _getRandomArrEl(artist.songs).preview;

    artists = artists.map(function (a) {
      return a.name;
    });
    var player = players.filter(function (player) {
      return player.likesAnyArtist(artists);
    })[0];
    if (option == 'allTime') option = 'all-time';
    return {
      question: "What is one of ".concat(player.name, "'s ").concat(option, " Top 10 artists?"),
      choices: artists,
      answers: artists.filter(function (a) {
        return player.likesArtist(a);
      }),
      song: preview,
      img: player.img
    };
  };

  var _getRandomSongs = function _getRandomSongs(players, option) {
    var songs = [];

    while (songs.length < 4) {
      var song = void 0;

      if (songs.length < players.length) {
        var player = _getRandomArrEl(players);

        song = player.pickRandomSong(option);
      } else {
        song = _getRandomArrEl(top50.songs);
      }

      if (!songs.map(function (s) {
        return s.toString;
      }).includes(song.toString)) {
        songs.push(song);
      }
    }

    return _shuffle(songs);
  };

  var _getRandomArtists = function _getRandomArtists(players, option) {
    var artists = [];

    while (artists.length < 4) {
      var artist = void 0;

      if (artists.length < players.length) {
        var player = _getRandomArrEl(players);

        artist = player.pickRandomArtist(option);
      } else {
        artist = _getRandomArrEl(top50.artists);
      }

      if (!artists.map(function (a) {
        return a.name;
      }).includes(artist.name)) {
        artists.push(artist);
      }
    }

    return _shuffle(artists);
  };

  var _getRandomArrEl = function _getRandomArrEl(arr) {
    return arr[(0, _getRandomInt["default"])(arr.length)];
  };

  var _shuffle = function _shuffle(array) {
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
  };

  return randomQuestion;
}