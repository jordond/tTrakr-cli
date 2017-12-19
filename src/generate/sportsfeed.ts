import fetch from "node-fetch";

const URL_API_BASE = "https://api.mysportsfeeds.com/v1.1/pull/nhl";
const URL_TEST_AUTH = `${URL_API_BASE}/current_season.json?fordate=20161220`;

export interface ISportsFeedCreds {
  login: string;
  password: string;
}

export function buildAuthHeader({ login, password }: ISportsFeedCreds) {
  return {
    headers: {
      Authorization: `Basic ${Buffer.from(login + ":" + password).toString(
        "base64"
      )}`
    }
  };
}

export async function validate(creds: ISportsFeedCreds): Promise<boolean> {
  try {
    const result = await fetch(URL_TEST_AUTH, buildAuthHeader(creds));
    return result.ok && result.status === 200;
  } catch (error) {
    return false;
  }
}
