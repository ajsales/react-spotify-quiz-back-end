"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = QuestionFactory;

var _getRandomInt = _interopRequireDefault(require("./helper/getRandomInt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Returns a function that generates questions
 *
 * @param {Object} top50 Extra Top 50 data to be added if not enough players
 */
function QuestionFactory(top50) {
  /**
   * Returns a random question.
   *
   * @param {Player[]} players Array of the players in the game
   */
  var randomQuestion = function randomQuestion(players) {
    // Restricts types of questions if there are less than 4 players
    var questions = [IdentifyFavoriteSong, IdentifyFavoriteArtist];

    if (players.length >= 4) {
      questions.concat([IdentifyPlayerFromSong, IdentifyPlayerFromArtist]);
    }

    var questionType = _getRandomArrEl(questions);

    var option = _getRandomArrEl(['recent', 'allTime']);

    return questionType(players, option);
  };
  /**
   * Returns a question of the type:
   * "What is one of Player 1's all-time Top 10 songs?"
   *
   * @param {Player[]} players Array of the players in the game
   * @param {string} option The Top 10 lists to be used
   */


  var IdentifyFavoriteSong = function IdentifyFavoriteSong(players, option) {
    var songs = _getRandomSongs(players, option);

    var preview = _getRandomArrEl(songs).preview;

    songs = songs.map(function (song) {
      return song.toString;
    });
    players = players.filter(function (player) {
      return player.likesAnySong(songs);
    });

    var player = _getRandomArrEl(players);

    var questionObj = {
      question: "What is one of ".concat(player.name, "'s ").concat(option, " Top 10 songs?"),
      choices: songs,
      answers: songs.filter(function (song) {
        return player.likesSong(song);
      }),
      song: preview,
      img: player.img
    };

    var pointCalculator = function pointCalculator(answerer, timer, choice) {
      if (answerer.name === player.name) {
        return timer * 0.75 * 4;
      } else {
        return timer * 4;
      }
    };

    return {
      questionObj: questionObj,
      pointCalculator: pointCalculator
    };
  };
  /**
   * Returns a question of the type:
   * "What is one of Player 1's all-time Top 10 artists?"
   *
   * @param {Player[]} players Array of the players in the game
   * @param {string} option The Top 10 lists to be used
   */


  var IdentifyFavoriteArtist = function IdentifyFavoriteArtist(players, option) {
    var artists = _getRandomArtists(players, option);

    var artist = _getRandomArrEl(artists);

    var preview = _getRandomArrEl(artist.songs).preview;

    artists = artists.map(function (a) {
      return a.name;
    });
    players = players.filter(function (player) {
      return player.likesAnyArtist(artists);
    });

    var player = _getRandomArrEl(players);

    var questionObj = {
      question: "What is one of ".concat(player.name, "'s ").concat(option, " Top 10 artists?"),
      choices: artists,
      answers: artists.filter(function (a) {
        return player.likesArtist(a);
      }),
      song: preview,
      img: player.img
    };

    var pointCalculator = function pointCalculator(answerer, timer, choice) {
      if (answerer.name === player.name) {
        return timer * 0.75 * 4;
      } else {
        return timer * 4;
      }
    };

    return {
      questionObj: questionObj,
      pointCalculator: pointCalculator
    };
  };

  var IdentifyPlayerFromSong = function IdentifyPlayerFromSong(players, option) {
    var songs = _getRandomSongs(players, option);

    var song = _getRandomArrEl(songs);

    var answers = players.filter(function (player) {
      return player.likesSong(song);
    });

    var choices = _getRandomPlayers(players, _getRandomArrEl(answers));

    var questionObj = {
      question: "Whose ".concat(option, " Top 10 song is ").concat(song.toString, "?"),
      choices: choices.map(function (player) {
        return player.name;
      }),
      answers: answers.map(function (player) {
        return player.name;
      }),
      song: song.preview,
      img: song.img
    };

    var pointCalculator = function pointCalculator(answerer, timer, choice) {
      if (answerer.name === choice) {
        return timer * 0.75 * 4;
      } else {
        return timer * 4;
      }
    };

    return {
      questionObj: questionObj,
      pointCalculator: pointCalculator
    };
  };

  var IdentifyPlayerFromArtist = function IdentifyPlayerFromArtist(players, option) {
    var artists = _getRandomArtists(players, option);

    var artist = _getRandomArrEl(artists);

    var preview = _getRandomArrEl(artist.songs).preview;

    var answers = player.filter(function (player) {
      return player.likesArtist(artist);
    });

    var choices = _getRandomPlayers(players, _getRandomArrEl(answers));

    var questionObj = {
      question: "Whose ".concat(option, " Top 10 artist is ").concat(artist.name, "?"),
      choices: choices.map(function (player) {
        return player.name;
      }),
      answers: answers.map(function (player) {
        return player.name;
      }),
      song: preview,
      img: artist.img
    };

    var pointCalculator = function pointCalculator(answerer, timer, choice) {
      if (answerer.name === choice) {
        return timer * 0.75 * 4;
      } else {
        return timer * 4;
      }
    };

    return {
      questionObj: questionObj,
      pointCalculator: pointCalculator
    };
  };

  var _getRandomPlayers = function _getRandomPlayers(players, included) {
    var result = [included];

    while (result.length < 4) {
      var curr = _getRandomArrEl(players);

      if (!result.map(function (p) {
        return p.name;
      }).includes(curr.name)) {
        result.push(curr);
      }
    }

    return _shuffle(result);
  };
  /**
   * Helper function to grab random songs from list of players
   *
   * @param {Player[]} players Array of the players in the game
   * @param {string} option The Top 10 lists to be used
   */


  var _getRandomSongs = function _getRandomSongs(players, option) {
    var songs = [];

    while (songs.length < 4) {
      var song = void 0; // Grabs at least a player's favorite song for each player in the game
      // Once it exceeds that, it'll grab a song from the extra Top 50 data

      if (songs.length < players.length) {
        var _player = _getRandomArrEl(players);

        song = _player.pickRandomSong(option);
      } else {
        song = _getRandomArrEl(top50.songs);
      } // Doesn't add song if already in array


      if (!songs.map(function (s) {
        return s.toString;
      }).includes(song.toString)) {
        songs.push(song);
      }
    }

    return _shuffle(songs);
  };
  /**
   * Helper function to grab random artists from list of players
   *
   * @param {Player[]} players Array of the players in the game
   * @param {string} option The Top 10 lists to be used
   */


  var _getRandomArtists = function _getRandomArtists(players, option) {
    var artists = [];

    while (artists.length < 4) {
      var artist = void 0; // Grabs at least a player's favorite artist for each player in the game
      // Once it exceeds that, it'll grab an artist from the extra Top 50 data

      if (artists.length < players.length) {
        var _player2 = _getRandomArrEl(players);

        artist = _player2.pickRandomArtist(option);
      } else {
        artist = _getRandomArrEl(top50.artists);
      } // Doesn't add artist if already in array


      if (!artists.map(function (a) {
        return a.name;
      }).includes(artist.name)) {
        artists.push(artist);
      }
    }

    return _shuffle(artists);
  };
  /**
   * Helper function to grab random element from array
   *
   * @param {[]} arr Array to be used
   */


  var _getRandomArrEl = function _getRandomArrEl(arr) {
    return arr[(0, _getRandomInt["default"])(arr.length)];
  };
  /**
   * Helper function to shuffle array
   *
   * @param {[]} array Array to be used
   */


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