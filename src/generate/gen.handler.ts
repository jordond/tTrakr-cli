import chalk from "chalk";
import { prompt } from "inquirer";

import Logger from "../utils/logger";
import { ISportsFeedCreds, validate } from "./sportsfeed";

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

    log.info(
      `Creds: login -> ${chalk.green(
        credentials.login
      )}, password -> ${chalk.green(credentials.password)}`
    );

    log.info("Validating...");
    if (await validate(credentials)) {
      log.info(chalk.green("SUCCESS"));
    } else {
      log.error("FAILED TO AUTH");
    }
  } catch (error) {
    log.error("Failed to generate NHL stats JSON...", error);
    process.exit(1);
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
