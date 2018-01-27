export function coinTossInt() {
  return Math.floor(Math.random() * 2);
}

export function coinToss() {
  return Math.floor(Math.random() * 2) === 0;
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomRangeInt(
  min: number,
  max: number,
  inclusive?: boolean
): number {
  return (
    Math.floor(
      Math.random() * (Math.floor(max) - Math.ceil(min) + (inclusive ? 1 : 0))
    ) + min
  );
}

export function randomMax(max: number, inclusive = false) {
  return randomRangeInt(0, max, inclusive);
}
