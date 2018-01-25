import { ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import { shuffle } from "../utils/misc";
import { length } from "../utils/object";
import { ISimulation } from "./ISimulation";
import { randomRangeInt } from "./rng";

// Working interface
export interface ISimGame {
  home: ISportsFeedTeam;
  away: ISportsFeedTeam;
  startInMinutes: number;
  details: ISimGameDetails;
}

// Firebase interface
export interface IDBSimGame {
  [homeaway: string]: {
    home: string;
    away: string;
    startInMinutes: number;
    details: ISimGameDetails;
  };
}

export interface ISimGameDetails {
  active: boolean;
  period: number;
  periodTime: number;
  finished: boolean;
  score: {
    home: number;
    away: number;
  };
  nextEventInMinutes: number;
}

export function buildGames(
  teams: ISportsFeedTeam[],
  { maxGames = -1, ...settings }: ISimulation
): ISimGame[] {
  if (!teams.length) {
    throw new Error("Game:buildGames -> No teams were passed in!");
  }

  // Ensure there are an even amount of teams
  const teamsToUse = shuffle(
    teams.length % 2 === 0 ? teams : teams.slice(0, teams.length - 1)
  );

  // If max games is 0 or -1, set to the length of the half the teams
  const adjustedMaxGames = maxGames > 0 ? maxGames : teamsToUse.length / 2;

  // Need to ensure there is enough teams for the games
  const numGamesToBuild =
    adjustedMaxGames > teamsToUse.length / 2
      ? teamsToUse.length / 2
      : adjustedMaxGames;

  const games: ISimGame[] = [];
  for (let index = 0; index < numGamesToBuild; index += 1) {
    const pair = shuffle(teamsToUse.splice(0, 2));
    games.push({
      home: pair[0],
      away: pair[1],
      startInMinutes: randomRangeInt(5, settings.startRange || 500),
      details: {
        active: false,
        finished: false,
        period: 1,
        periodTime: 20,
        score: {
          home: 0,
          away: 0
        },
        nextEventInMinutes: randomRangeInt(0, settings.chance || 5)
      }
    });
  }

  return games;
}

export function normalizeGames(games: ISimGame[]): IDBSimGame {
  return games.reduce((prev, curr: ISimGame) => {
    const { home, away, ...game } = curr;
    const key = `${home.abbreviation}_${away.abbreviation}`;
    return {
      ...prev,
      [key]: {
        home: home.abbreviation,
        away: away.abbreviation,
        ...game
      }
    };
  }, {});
}
