import { addMilliseconds } from "date-fns";

import { createMidnightDate } from "../utils/date";

export const DEFAULT_SPEED_FACTOR = 0;
export const MINUTE_IN_MILLIS = 60 * 1000.0;

export function simMinuteToRealMillis(factor: number = DEFAULT_SPEED_FACTOR) {
  return MINUTE_IN_MILLIS / (factor > 1 ? factor * 2 : 1);
}

export function calucluateDifference(
  simStart: Date,
  currentTime: Date = new Date()
) {
  return currentTime.getTime() - simStart.getTime();
}

export function calculateElapsedSimMillis(
  elapsedMillis: number,
  factor: number = DEFAULT_SPEED_FACTOR
) {
  return elapsedMillis * (factor > 0 ? (factor || 1) * 2 : 1);
}

export function getElapsedSimTime(
  factor: number = DEFAULT_SPEED_FACTOR,
  simStart: Date,
  currentTime: Date = new Date()
) {
  const simTime = createMidnightDate();

  const elapsedMillis = calucluateDifference(simStart, currentTime);
  const elapsedSimMillis = calculateElapsedSimMillis(elapsedMillis, factor);

  return addMilliseconds(simTime, elapsedSimMillis);
}
