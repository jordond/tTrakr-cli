import { addMinutes } from "date-fns";
import { ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import { createMidnightDate } from "../utils/date";
import { shuffle } from "../utils/misc";
import { ISimulation } from "./ISimulation";
import { randomRangeInt } from "./rng";

export const NUMBER_OF_PERIODS = 3;
export const NUMBER_MIN_IN_PERIOD = 20;

// Working interface
export interface ISimGame {
  home: ISportsFeedTeam;
  away: ISportsFeedTeam;
  startInMinutes: number;
  startTime: Date;
  details: ISimGameDetails;
}

// Firebase interface
export interface IDBSimGame {
  [homeaway: string]: {
    home: string;
    away: string;
    startInMinutes: number;
    startTime: Date;
    details: ISimGameDetails;
  };
}

export interface ISimGameDetails {
  active: boolean;
  period: number;
  periodEnd: Date;
  finished: boolean;
  score: {
    home: number;
    away: number;
  };
  nextEventInMinutes: number;
  nextEventTime: Date;
  winner: string;
}

export function buildGames(
  teams: ISportsFeedTeam[],
  { maxGames = -1, ...settings }: ISimulation
): ISimGame[] {
  if (!teams.length) {
    throw new Error("Game:buildGames -> No teams were passed in!");
  }

  // Ensure there are an even amount of teams
  const teamsToUse = shuffle([
    ...(teams.length % 2 === 0 ? teams : teams.slice(0, teams.length - 1))
  ]);

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

    const startInMinutes = randomRangeInt(5, settings.startRange || 500);
    const startTime = addMinutes(createMidnightDate(), startInMinutes);
    const nextEventInMinutes = randomRangeInt(0, settings.chance || 5);

    games.push({
      startInMinutes,
      startTime,
      home: pair[0],
      away: pair[1],
      details: {
        nextEventInMinutes,
        active: false,
        finished: false,
        period: 1,
        periodEnd: addMinutes(startTime, NUMBER_MIN_IN_PERIOD),
        score: {
          home: 0,
          away: 0
        },
        nextEventTime: addMinutes(startTime, nextEventInMinutes),
        winner: ""
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

export function sortByDate(lhs: ISimGame, rhs: ISimGame) {
  if (lhs.startInMinutes > rhs.startInMinutes) {
    return 1;
  }

  if (lhs.startInMinutes < rhs.startInMinutes) {
    return -1;
  }
  return 0;
}
