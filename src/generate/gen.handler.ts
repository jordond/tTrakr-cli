import c from "chalk";
import { outputJson } from "fs-extra";
import { prompt } from "inquirer";
import { join, resolve } from "path";

import { save } from "../config/config";
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

export const TAG = c`{cyan Generate}`;

const log = new Logger(TAG);

// TODO: use the output path from the config (if exists)

export default async function handler({
  config: { config = {} },
  login = "",
  password = "",
  output = "./",
  noConfig = false,
  configPath = process.cwd(),
  saveConfig = false,
  limit = -1,
  random = false
}: ICommandOptions): Promise<void> {
  const { sportsfeed = {} } = config;

  let tryCredentials: ISportsFeedCreds = { login, password };
  if (!noConfig) {
    log.info(c`Checking for {magenta saved} login info`);
    tryCredentials = {
      login: login || sportsfeed.login || "",
      password: password || sportsfeed.password || ""
    };
  }

  // If either username or password is missing, enable interactive mode
  const credentials: ISportsFeedCreds = isInteractive(tryCredentials)
    ? await askForCredentials(tryCredentials)
    : tryCredentials;

  // Validate the credentials with the API
  await validateCredentials(credentials);
  log.info(`{green ✔ Successfully} validated!`);

  // Grab all of the teams
  log.info(c`ℹ️ politely asking {cyan thesportsdb.com} for all the teams`);
  const teams = await getTeams();
  if (!teams.length) {
    log.error("😣  the mean server replied with no teams!");
    return exit(1);
  }

  log.info(c`🏒  found {cyan ${teams.length as any}} NHL teams!`);

  // If a limit was set, shrink the array
  let teamsToUse = [...teams];
  if (limit > 0) {
    if (random) {
      log.info(
        c`🌀  limiting to {cyan ${limit as any}} {magenta random} teams!`
      );
      teamsToUse = shuffle(teamsToUse);
    } else {
      log.info(c`📃  limiting to the first {cyan ${limit as any}} teams!`);
    }
    teamsToUse = teamsToUse.slice(0, limit);
  }

  // Add all the players to each team
  const allTeamsData = await buildTeamWithPlayers(teamsToUse, credentials);

  const outputPath = output || sportsfeed.output || "./";
  const filename = join(outputPath, "teams.json");
  log.info(c`📼   saving {cyan ${filename}}`);

  await outputJson(resolve(filename), allTeamsData, { spaces: 2 });
  log.info(c`🚝  choo choo! File was {green successfully} saved!`);
  log.info(
    c`💾  {blue ${resolve(filename)}} => {green ${getFileSizeOfObject(
      allTeamsData
    )}}`
  );

  if (saveConfig) {
    log.info("saving the config to a file!");
    const savePath = await save({
      sportsfeed: { ...credentials, output: outputPath }
    });
    if (savePath) {
      log.info(c`{green success!} saved config to {magenta ${savePath}}`);
    }
  }
}

function isInteractive({ login = "", password = "" }: ISportsFeedCreds) {
  return Boolean(!(login.length && password.length));
}

async function askForCredentials({ login, password }: ISportsFeedCreds) {
  const questions = [];
  log.info(c`Enter your login details for {cyan http://MySportsFeeds.com}`);

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
    log.e("Failed to gather login information", error);
    throw error;
  }
}

async function validateCredentials(credentials: ISportsFeedCreds) {
  const { password = "" } = credentials;
  log.debug(
    c`Creds: login -> {green ${credentials.login as any}}, password -> {green [redacted:${password.length as any}]}`
  );

  log.info(
    c`Attempting to validate {green ${credentials.login as any}} with {cyan www.mysportsfeed.com}`
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
    c`⛸️  fetching {cyan player} data for {cyan ${teams.length as any}} teams`
  );

  const results: ISportsFeedTeam[] = [];
  for (const [index, value] of teams.entries()) {
    const pos = () => {
      const p = index + 1;
      return `[${p < 10 ? "0" + p : p}/${teams.length}]`;
    };
    const pretty = () =>
      c`{magenta ${value.abbreviation}} -> {cyan ${value.name}}`;

    const players = await getPlayersForTeam(value.abbreviation, credentials);
    if (players && players.length) {
      log.debug(
        c`✔️  ${pos()} got {green ${players.length as any}} for ${pretty()}`
      );
      results.push({ ...value, players });
    } else {
      log.warning(`❌  ${pos()} failed to find players for ${pretty()}`);
    }
  }

  const difference = teams.length - results.length;
  if (difference) {
    log
      .info(`😕  was only able to grab data for some teams`)
      .warning(
        c`😢 couldn't grab data for {magenta ${difference as any}} teams`
      );
  } else {
    log.info(
      c`😃  {green successfully")} grabbed data for all {magenta ${teams.length as any}} teams`
    );
  }

  return results;
}
