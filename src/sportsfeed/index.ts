import c from "chalk";
import { transform } from "lodash";
import fetch from "node-fetch";

import { get } from "../utils/fetch";
import Logger from "../utils/logger";
import { camelize } from "../utils/misc";
import { ISportsFeedPlayer, ISportsFeedTeam } from "./ISportsFeed";
import { ensureAbbrev, teamMap, validateTeam } from "./nhlTeams";

const URL_NHL_TEAMS =
  "http://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=nhl";

const URL_API_BASE = "https://api.mysportsfeeds.com/v1.1/pull/nhl";
const URL_TEST_AUTH = `${URL_API_BASE}/current_season.json?fordate=20161220`;
const URL_PLAYERS = `${URL_API_BASE}/2016-2017-regular/roster_players.json?fordate=20161117`;

const TEAM_BLACKLIST: string[] = ["Vegas Golden Knights"];

export interface ISportsFeedCreds {
  login?: string;
  password?: string;
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

export async function getTeams(
  blacklist: string[] = TEAM_BLACKLIST
): Promise<ISportsFeedTeam[]> {
  const { teams = [] } = (await get(URL_NHL_TEAMS)) as any;
  return teams
    .filter((team: any) => !TEAM_BLACKLIST.includes(team.strTeam))
    .map((team: any) => ({
      abbreviation: teamMap[team.strTeam],
      name: team.strTeam,
      formed: team.intFormedYear,
      home: {
        stadium: team.strStadium,
        location: team.strStadiumLocation,
        thumbnail: team.strStadiumThumb
      },
      description: team.strDescriptionEN,
      images: {
        badge: team.strTeamBadge,
        jersey: team.strTeamJersey,
        logo: team.strTeamLogo
      }
    }));
}

export async function getPlayersForTeam(
  nameOrAbbrev: string,
  credentials: ISportsFeedCreds
): Promise<ISportsFeedPlayer[]> {
  try {
    if (!validateTeam(nameOrAbbrev)) {
      return [];
    }

    const teamURL = createTeamURL(nameOrAbbrev);
    const { rosterplayers: { playerentry: results = [] } } = (await get(
      teamURL,
      buildAuthHeader(credentials)
    )) as any;

    // Return a list of players, make sure the keys are camel-case
    return results.map((x: { player: any }) =>
      transform({ ...x.player }, (res: any, val: any, key: string) => {
        res[camelize(key)] = val;
      })
    );
  } catch (error) {
    return [];
  }
}

function createTeamURL(team: string): string {
  return `${URL_PLAYERS}&team=${ensureAbbrev(team).toLowerCase()}`;
}

export async function validateSportsFeedCredentials(
  credentials: ISportsFeedCreds,
  log: Logger,
  throws = true
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
    if (throws) {
      throw new Error("Authentication failed");
    }
    return false;
  }

  return true;
}
