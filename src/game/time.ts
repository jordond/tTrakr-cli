export const DEFAULT_SPEED_FACTOR = 0;
export const MINUTE_IN_MILLIS = 60 * 1000.0;

export function scaleMinsToMillis(speedFactor: number = 0) {
  return MINUTE_IN_MILLIS / (speedFactor > 1 ? speedFactor * 2 : 1);
}

export function scaleMinsToSeconds(speedFactor: number = 0) {
  return scaleMinsToMillis(speedFactor) / 1000;
}

export function scaleMillisToMins(speedFactor: number = 0) {
  return MINUTE_IN_MILLIS * speedFactor / MINUTE_IN_MILLIS;
}
