export const DEFAULT_SPEED_FACTOR = 0;
export const MINUTE_IN_MILLIS = 60 * 1000.0;

export function simMinuteToRealMillis(speedFactor: number = 0) {
  return MINUTE_IN_MILLIS / (speedFactor > 1 ? speedFactor * 2 : 1);
}

export function simMinutesToRealSeconds(speedFactor: number = 0) {
  return simMinuteToRealMillis(speedFactor) / 1000;
}

export function realMillisToSimMillis(
  speedFactor: number = 0,
  millis: number = 60 * 1000
) {
  return Math.floor(millis / (speedFactor > 1 ? speedFactor * 2 : 1) / 60 * 60);
}

export function realSecondToSimMillis(speedFactor: number = 0) {
  const denominator = speedFactor > 1 ? 1 : 60;
  return simMinuteToRealMillis(speedFactor) * 60 / denominator;
}

export function calucluateDifference(
  simStart: Date,
  currentTime: Date = new Date()
) {
  return currentTime.getTime() - simStart.getTime();
}
