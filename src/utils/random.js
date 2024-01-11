/**
 * Return a random number in a closed interval [min, max].
 */
function randomInInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Return a random number in [-50, +50]\[-10, +10].
 * We exclude numbers between -10 and +10 to ensure a "minimal" jitter.
 */
function randomJitter() {
  if (Math.random() <= 0.5) {
    return randomInInterval(-50, -10);
  } else {
    return randomInInterval(10, 50);
  }
}


export {
  randomInInterval,
  randomJitter,
};
