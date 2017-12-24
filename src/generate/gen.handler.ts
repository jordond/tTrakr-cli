import chalk from "chalk";
import { outputJson } from "fs-extra";
import { prompt } from "inquirer";
import { join, resolve } from "path";

import { load, save } from "../config/config";
import { exit } from "../index";
import {
  getPlayersForTeam,
  getTeams,
  ISportsFeedCreds,
  validate
} from "../sportsfeed";
import { ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import Logger from "../utils/logger";
import { getFileSizeOfObject, shuffle } from "../utils/misc";

const { cyan, green, magenta } = chalk;

export const TAG = cyan("Generate");

// Typescript complains about passing numbers to chalk
const s = (str: any) => `${str}`;

const log = new Logger(TAG);

// TODO: Use config object passed in by the middleware
// TODO: use the output path from the config (if exists)

export default async function({
  login = "",
  password = "",
  output = "./",
  noConfig = false,
  configPath = process.cwd(),
  saveConfig = false,
  limit = -1,
  random = false
}: ICommandOptions): Promise<void> {
  let tryCredentials: ISportsFeedCreds = { login, password };
  // If config is enabled (default) check for saved login information
  if (!noConfig) {
    log.info(`Checking for ${magenta("saved")} login info`);
    const { filepath, config } = await load(configPath);
    if (config && config.sportsfeed) {
      log.info(
        `using credentials from config file -> ${green(filepath as any)}`
      );
      tryCredentials = {
        login: login || config.sportsfeed.login,
        password: password || config.sportsfeed.password
      };
    }
  }

  // If either username or password is missing, enable interactive mode
  const credentials: ISportsFeedCreds = isInteractive(tryCredentials)
    ? await askForCredentials(tryCredentials)
    : tryCredentials;

  // Validate the credentials with the API
  await validateCredentials(credentials);
  log.info(`${green("✔ Successfully")} validated!`);

  // Grab all of the teams
  log.info(`ℹ️ politely asking ${cyan("thesportsdb.com")} for all the teams`);
  const teams = await getTeams();
  if (!teams.length) {
    log.error("😣  the mean server replied with no teams!");
    return exit(1);
  }

  log.info(`🏒  found ${cyan(s(teams.length))} NHL teams!`);

  // If a limit was set, shrink the array
  let teamsToUse = [...teams];
  if (limit > 0) {
    if (random) {
      log.info(`🌀  limiting to ${cyan(s(limit))} ${magenta("random")} teams!`);
      teamsToUse = shuffle(teamsToUse);
    } else {
      log.info(`📃  limiting to the first ${cyan(s(limit))} teams!`);
    }
    teamsToUse = teamsToUse.slice(0, limit);
  }

  // Add all the players to each team
  const allTeamsData = await buildTeamWithPlayers(teamsToUse, credentials);

  const filename = join(output, "teams.json");
  log.info(`📼   saving ${cyan(filename)}`);

  await outputJson(resolve(filename), allTeamsData, { spaces: 2 });
  log.info(`🚝  choo choo! File was ${green("successfully")} saved!`);
  log.info(
    `💾  ${chalk.blue(resolve(filename))} => ${green(
      getFileSizeOfObject(allTeamsData)
    )}`
  );

  if (saveConfig) {
    log.info("saving the config to a file!");
    const savePath = await save({ sportsfeed: { ...credentials, output } });
    if (savePath) {
      log.info(`${green("success!")} saved config to ${magenta(savePath)}`);
    }
  }
}

function isInteractive({ login = "", password = "" }: ISportsFeedCreds) {
  return Boolean(!(login.length && password.length));
}

async function askForCredentials({ login, password }: ISportsFeedCreds) {
  const questions = [];
  log.info(`Enter your login details for ${cyan("http://MySportsFeeds.com")}`);

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
    `Creds: login -> ${green(credentials.login as any)}, password -> ${green(
      "[redacted:" + credentials!.password!.length + "]"
    )}`
  );

  log.info(
    `Attempting to validate ${green(credentials.login as any)} with ${cyan(
      "www.mysportsfeed.com"
    )}`
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

async function buildTeamWithPlayers(
  teams: ISportsFeedTeam[],
  credentials: ISportsFeedCreds
) {
  log.info(
    `⛸️  fetching ${cyan("player")} data for ${cyan(s(teams.length))} teams`
  );

  const results: ISportsFeedTeam[] = [];
  for (const [index, value] of teams.entries()) {
    const pos = () => {
      const p = index + 1;
      return `[${p < 10 ? "0" + p : p}/${teams.length}]`;
    };
    const pretty = () =>
      `${magenta(value.abbreviation)} -> ${cyan(value.name)}`;

    const players = await getPlayersForTeam(value.abbreviation, credentials);
    if (players && players.length) {
      log.debug(`✔️  ${pos()} got ${green(s(players.length))} for ${pretty()}`);
      results.push({ ...value, players });
    } else {
      log.warning(`❌  ${pos()} failed to find players for ${pretty()}`);
    }
  }

  const difference = teams.length - results.length;
  if (difference) {
    log
      .info(`😕  was only able to grab data for some teams`)
      .warning(`😢 couldn't grab data for ${magenta(s(difference))} teams`);
  } else {
    log.info(
      `😃  ${green("successfully")} grabbed data for all ${magenta(
        s(teams.length)
      )} teams`
    );
  }

  return results;
}
