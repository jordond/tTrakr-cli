const DEVELOPMENT: string = "development";
const PRODUCTION: string = "production";
const TEST: string = "test";

export enum ENV {
  DEVELOPMENT,
  PRODUCTION,
  TEST
}

export const env = () =>
  [DEVELOPMENT, PRODUCTION, TEST].includes(
    (process.env.NODE_ENV || DEVELOPMENT).toLowerCase()
  )
    ? DEVELOPMENT
    : process.env.NODE_ENV;
