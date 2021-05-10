/**
 * Helper function to get random number within range (0, max - 1)
 *
 * @param {int} max Max number to include
 */
export default function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}