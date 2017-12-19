import fetch from "node-fetch";

import { get } from "../utils/fetch";
import { ISportsFeedPlayers, ISportsFeedTeam } from "./ISportsFeed";
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
): Promise<ISportsFeedPlayers[]> {
  try {
    if (!validateTeam(nameOrAbbrev)) {
      return [];
    }

    const teamURL = createTeamURL(nameOrAbbrev);
    const { rosterplayers: { playerentry: results = [] } } = (await get(
      teamURL,
      buildAuthHeader(credentials)
    )) as any;
    return results.map((x: { player: any }) => ({ ...x.player }));
  } catch (error) {
    return [];
  }
}

function createTeamURL(team: string): string {
  return `${URL_PLAYERS}&team=${ensureAbbrev(team).toLowerCase()}`;
}
