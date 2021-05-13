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

    this.host = host.name;
    this.players = [host];
    this.points = _defineProperty({}, host.name, 0);
    this.id = (0, _getRandomString["default"])(6);
    this.questionFactory = (0, _questionFactory["default"])(top50);
    this.pastQuestions = [];
  }

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
     * Adds player to game's list of players
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
      }

      if (!Object.keys(this.points).includes(newPlayer.name)) {
        this.points[newPlayer.name] = 0;
      }
    }
    /**
     * Removes player from game's list of player
     * 
     * @param {Player} oldPlayer The player to be removed
     */

  }, {
    key: "removePlayer",
    value: function removePlayer(oldPlayer) {
      this.players = this.players.filter(function (player) {
        return player.name !== oldPlayer.name;
      });
    }
    /**
     * Returns a random question.
     */

  }, {
    key: "question",
    value: function question() {
      var _this$questionFactory = this.questionFactory(this.players),
          questionObj = _this$questionFactory.questionObj,
          pointCalculator = _this$questionFactory.pointCalculator;

      while (askedAlready(questionObj, this.pastQuestions)) {
        var _this$questionFactory2 = this.questionFactory(this.players),
            _questionObj = _this$questionFactory2.questionObj,
            _pointCalculator = _this$questionFactory2.pointCalculator;
      }

      this.pointCalculator = pointCalculator;
      this.answered = {};

      for (var player in this.players) {
        this.answered[player.name] = false;
      }

      this.pastQuestions.push(questionObj);
      return questionObj;
    }
  }, {
    key: "answerQuestion",
    value: function answerQuestion(player, correct, timer) {
      this.answered[player.name] = true;

      if (correct) {
        this.points[player.name] += this.pointCalculator(player, timer);
      }
    }
  }]);

  return Game;
}();

exports["default"] = Game;

var askedAlready = function askedAlready(question, questionList) {
  var _iterator = _createForOfIteratorHelper(questionList),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var pastQuestion = _step.value;

      if (areQuestionsEqual(question, pastQuestion)) {
        return true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return false;
};

var areQuestionsEqual = function areQuestionsEqual(q1, q2) {
  return q1.question === q2.question && areArraysEqual(q1.choices, q2.choices);
};

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