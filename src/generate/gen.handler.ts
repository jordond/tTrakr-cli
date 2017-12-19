import chalk from "chalk";
import { prompt } from "inquirer";

import { exit } from "../index";
import { ISportsFeedCreds, validate } from "../sportsfeed";
import Logger from "../utils/logger";

const log = new Logger(chalk.cyan("Generate"));

export default async function({
  login = "",
  password = "",
  savedCredentials = true,
  output = "./"
}: ICommandOptions): Promise<void> {
  try {
    const isInteractive: boolean = Boolean(!(login.length && password.length));
    const credentials: ISportsFeedCreds = isInteractive
      ? await askForCredentials({ login, password })
      : { login, password };

    await validateCredentials(credentials);
    log.info(chalk.green("✔ Successfully validated!"));
  } catch (error) {
    log.error("Failed to generate NHL stats JSON");
    exit(1);
  }
}

async function askForCredentials({ login, password }: ISportsFeedCreds) {
  const questions = [];
  log.info("Enter your login details for http://MySportsFeeds.com");

  if (!login) {
    questions.push({
      type: "input",
      name: "login",
      message: "Enter your login:",
      validate(input = "") {
        if (input.length) {
          return true;
        }
        return "Please enter a valid login (non-empty)";
      }
    });
  }

  if (!password) {
    questions.push({
      type: "password",
      name: "password",
      message: "Enter your password:",
      validate(input = "") {
        if (input.length) {
          return true;
        }
        return "Please enter a valid password";
      }
    });
  }

  try {
    const result = await prompt(questions);
    return { login, password, ...result };
  } catch (error) {
    log.e("Failed to gather login information", error);
    throw error;
  }
}

async function validateCredentials(credentials: ISportsFeedCreds) {
  log.debug(
    `Creds: login -> ${chalk.green(
      credentials.login
    )}, password -> ${chalk.green(credentials.password)}`
  );

  log.info(
    `Attempting to validate ${chalk.green(
      credentials.login
    )} with www.mysportsfeed.com`
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
