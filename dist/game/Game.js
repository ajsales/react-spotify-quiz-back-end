"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getRandomString = _interopRequireDefault(require("./helper/getRandomString"));

var _questionFactory = _interopRequireDefault(require("./questionFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game = /*#__PURE__*/function () {
  function Game(host, top50) {
    _classCallCheck(this, Game);

    this.host = host.id;
    this.players = [host];
    this.points = _defineProperty({}, host.name, 0);
    this.id = (0, _getRandomString["default"])(6);
    this.questionFactory = (0, _questionFactory["default"])(top50);
    this.answered = {};
    this.pastQuestions = [];
  }
  /**
   * Sends player array for front-end to display.
   */


  _createClass(Game, [{
    key: "currentPlayers",
    get: function get() {
      var _this = this;

      return this.players.map(function (player) {
        return {
          name: player.name,
          img: player.img,
          points: _this.points[player.name]
        };
      });
    }
    /**
     * Adds player to game's list of players.
     * 
     * @param {Player} newPlayer The player to be added
     */

  }, {
    key: "addPlayer",
    value: function addPlayer(newPlayer) {
      if (!this.players.map(function (p) {
        return p.name;
      }).includes(newPlayer.name)) {
        this.players.push(newPlayer);
      } // Initializes player in points array


      if (!(newPlayer.name in this.points)) {
        this.points[newPlayer.name] = 0;
      }
    }
    /**
     * Removes player from game's list of players.
     * 
     * @param {Player} oldPlayer The player to be removed
     */

  }, {
    key: "removePlayer",
    value: function removePlayer(oldPlayer) {
      this.players = this.players.filter(function (player) {
        return player.name !== oldPlayer.name;
      });

      if (this.players.length > 0) {
        if (this.host === oldPlayer.id) {
          this.host = this.players[0].id;
        } // Removes player from answered array so game
        // isn't frozen with removed player


        if (oldPlayer.name in this.answered) {
          delete this.answered[oldPlayer.name];
        }
      }
    }
    /**
     * Returns a random question.
     */

  }, {
    key: "question",
    value: function question() {
      var _this$questionFactory = this.questionFactory(this.players),
          questionObj = _this$questionFactory.questionObj,
          pointCalculator = _this$questionFactory.pointCalculator; // Checks to see if question has already been asked already


      while (askedAlready(questionObj, this.pastQuestions)) {
        var _this$questionFactory2 = this.questionFactory(this.players),
            _questionObj = _this$questionFactory2.questionObj,
            _pointCalculator = _this$questionFactory2.pointCalculator;
      } // Sets current point calculator


      this.pointCalculator = pointCalculator; // Initalizes answered array to false

      var _iterator = _createForOfIteratorHelper(this.players),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var player = _step.value;
          this.answered[player.name] = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.pastQuestions.push(questionObj);
      return questionObj;
    }
    /**
     * Notes player answering a question and gives them points of correct.
     * 
     * @param {Player} player The player who answered
     * @param {boolean} correct True, if player answered correctly
     * @param {int} timer Time left when player answered
     */

  }, {
    key: "answerQuestion",
    value: function answerQuestion(player, correct, timer) {
      this.answered[player.name] = true;

      if (correct) {
        this.points[player.name] += this.pointCalculator(player, timer);
      }
    }
    /**
     * Returns true if everyone answered current question.
     */

  }, {
    key: "isEveryoneFinished",
    value: function isEveryoneFinished() {
      return Object.values(this.answered).every(function (value) {
        return value;
      });
    }
    /**
     * Resets game.
     */

  }, {
    key: "reset",
    value: function reset() {
      for (var player in this.points) {
        this.points[player] = 0;
      }

      this.pastQuestions = [];
    }
  }]);

  return Game;
}(); // Helper function for if question has already been asked


exports["default"] = Game;

var askedAlready = function askedAlready(question, questionList) {
  return questionList.some(function (pastQuestion) {
    return areQuestionsEqual(question, pastQuestion);
  });
}; // Helper function for if two questions are equal
// (i.e. when question prompt is the same and the
// choices are the same)


var areQuestionsEqual = function areQuestionsEqual(q1, q2) {
  return q1.question === q2.question && areArraysEqual(q1.choices, q2.choices);
}; // Helper function for if two arrays are equal


var areArraysEqual = function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  var _iterator2 = _createForOfIteratorHelper(arr1),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var a = _step2.value;
      if (!arr2.includes(a)) return false;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return true;
};