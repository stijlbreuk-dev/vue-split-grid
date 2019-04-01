/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */

// No easing, no acceleration
export function linear(t) {
  return t;
}

// Accelerating from zero velocity
export function easeInQuad(t) {
  return t * t;
}

// Decelerating to zero velocity
export function easeOutQuad(t) {
  return t * (2 - t);
}

// Acceleration until halfway, then deceleration
export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Accelerating from zero velocity
export function easeInCubic(t) {
  return t * t * t;
}

// Decelerating to zero velocity
export function easeOutCubic(t) {
  return --t * t * t + 1;
}

// Acceleration until halfway, then deceleration
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Accelerating from zero velocity
export function easeInQuart(t) {
  return t * t * t * t;
}

// Decelerating to zero velocity
export function easeOutQuart(t) {
  return 1 - --t * t * t * t;
}

// Acceleration until halfway, then deceleration
export function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}

// Accelerating from zero velocity
export function easeInQuint(t) {
  return t * t * t * t * t;
}

// Decelerating to zero velocity
export function easeOutQuint(t) {
  return 1 + --t * t * t * t * t;
}

// Acceleration until halfway, then deceleration
export function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
