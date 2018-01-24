export function createDate(params: number[]) {
  const date = new Date();
  date.setHours.apply(date, params);
  return date;
}

export function createMidnightDate() {
  return createDate([0, 0, 0, 0]);
}
