import Ajv from "ajv";

import { IDBPlayers, IDBTeams } from "../simulation/simulation";
import { ISportsFeedPlayer, ISportsFeedTeam } from "./ISportsFeed";
import schema from "./nhlTeamsSchema";

export const teamMap = {
  "Anaheim Ducks": "ANA",
  "Arizona Coyotes": "ARI",
  "Boston Bruins": "BOS",
  "Buffalo Sabres": "BUF",
  "Calgary Flames": "CGY",
  "Carolina Hurricanes": "CAR",
  "Chicago Blackhawks": "CHI",
  "Colorado Avalanche": "COL",
  "Columbus Blue Jackets": "CBJ",
  "Dallas Stars": "DAL",
  "Detroit Red Wings": "DET",
  "Edmonton Oilers": "EDM",
  "Florida Panthers": "FLO",
  "Los Angeles Kings": "LAK",
  "Minnesota Wild": "MIN",
  "Montreal Canadiens": "MTL",
  "Nashville Predators": "NSH",
  "New Jersey Devils": "NJD",
  "New York Islanders": "NYI",
  "New York Rangers": "NYR",
  "Ottawa Senators": "OTT",
  "Philadelphia Flyers": "PHI",
  "Pittsburgh Penguins": "PIT",
  "San Jose Sharks": "SJS",
  "St. Louis Blues": "STL",
  "Tampa Bay Lightning": "TBL",
  "Toronto Maple Leafs": "TOR",
  "Vancouver Canucks": "VAN",
  "Washington Capitals": "WSH",
  "Winnipeg Jets": "WPJ"
} as any;

export function validateTeam(nameOrAbbrev: string): boolean {
  return Boolean(ensureAbbrev(nameOrAbbrev));
}

export function ensureAbbrev(nameOrAbbrev: string): string {
  if (teamMap[nameOrAbbrev]) {
    return teamMap[nameOrAbbrev];
  }
  return Object.values(teamMap).find(x => nameOrAbbrev === x);
}

export function validateSchema(data: any, throws: boolean = true) {
  const validate = new Ajv().compile(schema);
  const isValid = validate(data);

  if (!isValid) {
    if (throws) {
      throw new Error(`Unable to validate: ${validate.errors}`);
    }
    return false;
  }
  return true;
}

export function normalizeSportsFeed(data: ISportsFeedTeam[]) {
  return data.reduce(
    (prev, curr: ISportsFeedTeam) => {
      const { players = [], ...team } = curr;
      const normalizedPlayers = players.reduce(
        (p, c) => ({
          [createPlayerKey(c)]: c,
          ...p
        }),
        {}
      );

      return {
        teams: {
          [team.abbreviation]: team,
          ...prev.teams
        },
        players: {
          [team.abbreviation]: normalizedPlayers,
          ...prev.players
        }
      };
    },
    { teams: [], players: [] }
  );
}

export function deNormalizeSportsFeed({
  teams,
  players
}: {
  teams: IDBTeams;
  players: IDBPlayers;
}) {
  return Object.values(teams).map(team => ({
    ...team,
    players: Object.values(players[team.abbreviation] || {})
  }));
}

export function createPlayerKey({ firstName, lastName }: ISportsFeedPlayer) {
  return `${firstName.charAt(0)}${lastName}`.toLowerCase();
}
