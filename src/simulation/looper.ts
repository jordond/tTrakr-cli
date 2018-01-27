import c from "chalk";
import { addMinutes } from "date-fns";
import { sample, sampleSize } from "lodash";

import { DB_PATH_GAMES, update } from "../firebase/database";
import { ISportsFeedPlayer, ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import { createPlayerKey } from "../sportsfeed/nhlTeams";
import { Logger } from "../utils/logger";
import {
  ISimGame,
  ISimGameGoal,
  normalizeGame,
  NUMBER_MIN_IN_PERIOD,
  NUMBER_OF_PERIODS
} from "./game";
import { ISimulation } from "./ISimulation";
import { coinToss, randomMax, randomRangeInt } from "./rng";
import { getElapsedSimTime, simMinuteToRealMillis } from "./time";

export const TAG = c`{green Sim}`;

export class Looper {
  public active: boolean = false;

  private _resolve: (value?: any) => void;
  private _interval: NodeJS.Timer | null;
  private _log: Logger;

  private _settings: ISimulation;
  private _games: ISimGame[];
  private _finishedGames: ISimGame[] = [];
  private _minutesElapsed: number = 0;

  constructor(resolve: (value: any) => void) {
    this._resolve = resolve;
    this._log = new Logger(TAG);
  }

  public start(settings: ISimulation, games: ISimGame[]) {
    if (!this.active && !this._interval) {
      const oneSimMinute = simMinuteToRealMillis(settings.factor);
      this._settings = settings;
      this._games = games;
      this._interval = setInterval(() => this.loop(), oneSimMinute);
      this.active = true;
    }
  }

  public destroy() {
    if (this.active && this._interval) {
      clearInterval(this._interval);
      this.active = false;
      this._interval = null;
      this._resolve();
    }
  }

  private async loop() {
    this._minutesElapsed += 1;

    if (this._minutesElapsed % 10 === 0 || this._minutesElapsed === 1) {
      this._log.info(c`{grey ${this.buildLogPrefix()}- Time Update}`);
      if (this._finishedGames && this._finishedGames.length) {
        this._log.debug(
          c`there are {green ${this._finishedGames
            .length as any}} finished {cyan games}`
        );
      }
    }

    this._games = this._games.filter(this.processGame.bind(this));

    if (this._games.length === 0) {
      this._log.info(c`{magenta all} the games are {red finished}!`);
      this.destroy();
    }
  }

  private createTeamLog({
    home,
    away
  }: {
    home: ISportsFeedTeam;
    away: ISportsFeedTeam;
  }) {
    return new Logger(
      c`{cyan ${home.abbreviation}}|{magenta ${away.abbreviation}}`,
      this.buildLogPrefix.bind(this)
    );
  }

  private processGame(
    { home, away, startTime, details, ...rest }: ISimGame,
    index: number
  ): boolean {
    const log = this.createTeamLog({ home, away });
    let hasUpdate: boolean = false;

    // Start the game
    if (!details.active && !details.finished && this.isPast(startTime)) {
      details.active = true;

      log.info(
        c`game is {green Starting}! {bold event} at ${displayTime(
          details.nextEventTime
        )}`
      );

      hasUpdate = true;
    }

    if (!details.active) {
      return true;
    }

    // Game is active

    // Handle the period ending, and game ending
    if (this.isPast(details.periodEnd)) {
      if (details.period === NUMBER_OF_PERIODS) {
        const { home: hScore, away: aScore } = details.score;
        const calcPenalty = (abbrev: string) =>
          details.penalties.filter(x => x.team === abbrev).length as any;

        log.i(
          c`game is {bold {red over}}! score: {cyan ${
            home.abbreviation
          }}: {grey [{green ${hScore as any}}/{red ${calcPenalty(
            home.abbreviation
          )}}]} -- {magenta ${
            away.abbreviation
          }}: {grey [{green ${aScore as any}}/{red ${calcPenalty(
            away.abbreviation
          )}}]}`
        );

        details.finished = true;
        details.active = false;
        details.winner =
          hScore !== aScore
            ? (hScore > aScore ? home : away).abbreviation
            : "TIE";
        log.info(c`the winner is {green ${details.winner}}!`);

        this._finishedGames.push({ home, away, startTime, details, ...rest });
      } else {
        details.period += 1;
        details.periodEnd = this.addMinsToTime(NUMBER_MIN_IN_PERIOD);
        log.debug(
          c`starting period {blue ${details.period as any}} and will end at ${displayTime(
            details.periodEnd
          )}`
        );
      }

      hasUpdate = true;
    }

    // Check if an event needs to happen
    if (this.isPast(details.nextEventTime)) {
      const nextEvent = this.addMinsToTime(
        randomMax((this._settings.chance as number) + 3)
      );
      details.nextEventTime = nextEvent;
      log.debug(c`next event at ${displayTime(nextEvent)}`);

      const { abbreviation: team, players } = coinToss() ? home : away;
      const event = randomRangeInt(0, 4);
      if (event === 1) {
        // Is a goal
        const inclPlayers = sampleSize(players, randomRangeInt(1, 4)).map(
          createPlayerKey
        );

        const goal: ISimGameGoal = {
          team,
          player: inclPlayers.splice(0, 1)[0],
          assist: inclPlayers
        };
        details.goals.push(goal);
        details.score[team === home.abbreviation ? "home" : "away"] += 1;

        log.i(c`GOAL: {blue ${team}} {green ${goal.player}} scored a goal`);
        if (goal.assist.length) {
          log.debug(
            c`\t {magenta assist} from {green ${goal.assist.toString()}}`
          );
        }
        hasUpdate = true;
      } else if (event === 2) {
        // Is a penalty
        const player = createPlayerKey(sample(players) as ISportsFeedPlayer);
        details.penalties.push({ team, player });

        log.i(c`{blue ${team}} {red ${player}} recieved a {red penalty}`);
        hasUpdate = true;
      }
    }

    // Update FIREBASE with the changed data
    if (hasUpdate) {
      log.debug(c`{green update} is required!`);
      const data = normalizeGame({ home, away, startTime, details, ...rest });
      update(DB_PATH_GAMES, data);
    }

    return !details.finished;
  }

  private calcSimTime(): Date {
    const { factor, start } = this._settings;
    return getElapsedSimTime(factor, start as Date);
  }

  private addMinsToTime(minutes: number) {
    return addMinutes(this.calcSimTime(), minutes);
  }

  private buildLogPrefix() {
    return c`{grey [{yellow ${this.calcSimTime().toLocaleTimeString()}}]} `;
  }

  private isPast(target: Date, current = this.calcSimTime()): boolean {
    return target < current;
  }
}

function displayTime(time: Date): string {
  return c`{grey [{blue ${time.toLocaleTimeString()}}]}`;
}
