import c from "chalk";
import { outputJson } from "fs-extra";
import { join, resolve } from "path";

import { save } from "../../config/config";
import { exit } from "../../middleware";
import {
  getPlayersForTeam,
  getTeams,
  ISportsFeedCreds,
  validateSportsFeedCredentials
} from "../../sportsfeed";
import { ISportsFeedTeam } from "../../sportsfeed/ISportsFeed";
import Logger from "../../utils/logger";
import { getFileSizeOfObject, shuffle } from "../../utils/misc";
import { askForCredentials } from "../../utils/prompt";

export const TAG = c`{cyan Generate}`;
const log = new Logger(TAG);

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
    ? await askForCredentials(
        tryCredentials,
        "http://www.mysportsfeed.com",
        log
      )
    : tryCredentials;

  // Validate the credentials with the API
  await validateSportsFeedCredentials(credentials, log);
  log.info(c`{green ✔ Successfully} validated!`);

  // Grab all of the teams
  log.info(c`ℹ️ politely asking {cyan thesportsdb.com} for all the teams`);
  const teams = await getTeams();
  if (!teams.length) {
    log.error("😣  the mean server replied with no teams!");
    throw new Error("SportsFeed.com returned no team results");
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

  const outputPath = resolve(output || sportsfeed.output || "./");
  const filepath = join(outputPath, "teams.json");
  log.info(c`📼   saving {cyan "teams.json"}`);

  await outputJson(filepath, allTeamsData, { spaces: 2 });
  log.info(c`🚝  choo choo! File was {green successfully} saved!`);
  log.info(
    c`💾  {blue ${filepath}} => {green ${getFileSizeOfObject(allTeamsData)}}`
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

  exit();
}

function isInteractive({ login = "", password = "" }: ISportsFeedCreds) {
  return Boolean(!(login.length && password.length));
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
      c`😃  {green successfully} grabbed data for all {magenta ${teams.length as any}} teams`
    );
  }

  return results;
}
