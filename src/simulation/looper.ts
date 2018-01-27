import c from "chalk";
import { addMinutes } from "date-fns";

import { Logger } from "../utils/logger";
import { ISimGame, NUMBER_MIN_IN_PERIOD, NUMBER_OF_PERIODS } from "./game";
import { ISimulation } from "./ISimulation";
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

    if (this._minutesElapsed % 10 === 0) {
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

  private processGame(
    { home, away, startTime, details, ...rest }: ISimGame,
    index: number
  ): boolean {
    const log = new Logger(
      c`{cyan ${home.abbreviation}}|{magenta ${away.abbreviation}}`,
      this.buildLogPrefix.bind(this)
    );

    // Start the game
    if (!details.active && !details.finished && this.isPast(startTime)) {
      details.active = true;

      log.info(
        c`game is {green Starting}! {bold event} at {grey [{blue ${details.nextEventTime.toLocaleTimeString()}}]}`
      );
    }

    if (!details.active) {
      return true;
    }

    // Game is active

    // Handle the period ending, and game ending
    if (this.isPast(details.periodEnd)) {
      if (details.period === NUMBER_OF_PERIODS) {
        const { home: hScore, away: aScore } = details.score;
        log.i(
          c`game is {bold {red over}}! score: {cyan ${
            home.abbreviation
          }}:{cyan ${hScore as any}} -- {magenta ${
            away.abbreviation
          }}:{magenta ${aScore as any}}`
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
        details.periodEnd = addMinutes(
          this.calcSimTime(),
          NUMBER_MIN_IN_PERIOD
        );
      }
    }

    // Check if an event needs to happen
    // Choose whether its a goal or penalty
    // Decide who scored for which team, and any assists

    // Update FIREBASE with the changed data

    return !details.finished;
  }

  private calcSimTime(): Date {
    const { factor, start } = this._settings;
    return getElapsedSimTime(factor, start as Date);
  }

  private buildLogPrefix() {
    return c`{grey [{yellow ${this.calcSimTime().toLocaleTimeString()}}]} `;
  }

  private isPast(target: Date, current = this.calcSimTime()): boolean {
    return target < current;
  }
}
