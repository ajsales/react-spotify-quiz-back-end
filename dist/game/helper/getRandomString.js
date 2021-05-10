"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getRandomString;

/**
 * Helper function to generate random string of a given length
 *
 * @param {int} length The length of the string to be returned
 */
function getRandomString(length) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';

  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }

  return result;
}