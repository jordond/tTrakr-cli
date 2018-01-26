import c from "chalk";

import { Logger } from "../utils/logger";
import { ISimGame } from "./game";
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
  private _finishedGames: ISimGame[];
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

    const activeGames = this._games.filter(this.processGame.bind(this));

    if (activeGames.length === 0) {
      this._log.info(
        c`Simulation ended, {magenta all} the games are {red finished}!`
      );
      this.destroy();
    }
  }

  private processGame(
    { home, away, startInMinutes, details }: ISimGame,
    index: number
  ): boolean {
    const log = new Logger(
      c`{cyan ${home.abbreviation}}|{magenta ${away.abbreviation}}`,
      this.buildLogPrefix.bind(this)
    );

    // Start the game
    if (!details.active && this._minutesElapsed >= startInMinutes) {
      details.active = true;

      log.info(c`game is {green Starting}!`);
      log.info(
        c`next {yellow event} at {grey [{blue ${details.nextEventTime.toLocaleTimeString()}}]}`
      );
    }

    if (!details.active) {
      return true;
    }

    // Game is active

    // Compare details.periodEnd vs currentSimTime

    // If period is over
    // If last period, end game figure out who won

    // Increment the period, set new periodEnd time 20 mins

    // Check if an event needs to happen
    // Choose whether its a goal or penalty
    // Decide who scored for which team, and any assists

    // Update FIREBASE with the changed data

    return true;
  }

  private calculateSimTime(): Date {
    const { factor, start } = this._settings;
    return getElapsedSimTime(factor, start as Date);
  }

  private buildLogPrefix() {
    return c`{grey [{yellow ${this.calculateSimTime().toLocaleTimeString()}}]} `;
  }
}
