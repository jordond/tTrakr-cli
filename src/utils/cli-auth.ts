import c from "chalk";
import { prompt } from "inquirer";

import { ISportsFeedCreds, validate } from "../sportsfeed";
import Logger from "./logger";

export interface IBasicCredentials {
  login?: string;
  password?: string;
}

export async function askForCredentials(
  { login, password }: IBasicCredentials,
  website: string,
  log: Logger
) {
  const questions = [];
  log.info(c`Enter your login details for {cyan ${website}}`);

  if (!login) {
    questions.push({
      type: "input",
      name: "login",
      message: "Enter your login:",
      validate: (input = "") =>
        Boolean(input.length) || "Please enter a valid login (non-empty)"
    });
  }

  if (!password) {
    questions.push({
      type: "password",
      name: "password",
      message: "Enter your password:",
      validate: (input = "") =>
        Boolean(input.length) || "Please enter a valid password"
    });
  }

  try {
    const result = await prompt(questions);
    return { login, password, ...result };
  } catch (error) {
    log.e(`Failed to gather login information for ${website}`, error);
    throw error;
  }
}

export async function validateSportsFeedCredentials(
  credentials: ISportsFeedCreds,
  log: Logger
) {
  const { login, password = "" } = credentials;
  log.debug(
    c`Creds: login -> {green ${login as any}}, password -> {green [redacted:${password.length as any}]}`
  );

  log.info(
    c`Attempting to validate {green ${login as any}} with {cyan www.mysportsfeed.com}`
  );

  const invalidLogin = !await validate(credentials);
  if (invalidLogin) {
    log.e(
      "✘ Failed to authenticate, ensure your username/password is correct!"
    );
    throw new Error("Authentication failed");
  }

  return true;
}
