"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getRandomString = _interopRequireDefault(require("./helper/getRandomString"));

var _questionFactory = _interopRequireDefault(require("./questionFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  }
  /**
   * Adds player to game's list of players
   * 
   * @param {Player} newPlayer The player to be added
   */


  _createClass(Game, [{
    key: "addPlayer",
    value: function addPlayer(newPlayer) {
      if (!this.players.map(function (p) {
        return p.name;
      }).includes(newPlayer.name)) {
        this.players.push(newPlayer);
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
      return this.questionFactory(this.players);
    }
  }]);

  return Game;
}();

exports["default"] = Game;