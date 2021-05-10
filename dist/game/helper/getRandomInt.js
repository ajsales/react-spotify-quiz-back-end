"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getRandomInt;

/**
 * Helper function to get random number within range (0, max - 1)
 *
 * @param {int} max Max number to include
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}