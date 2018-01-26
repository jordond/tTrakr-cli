import c from "chalk";

import { addMinutes } from "date-fns";
import { Logger } from "../utils/logger";
import { ISimGame } from "./game";
import { ISimulation } from "./ISimulation";
import { randomRangeInt } from "./rng";
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
  private _minutes: number = 0;

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
    // Update the time keeper
    this._minutes += 1;

    if (this._minutes % 10 === 0) {
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

    if (!details.active && this._minutes >= startInMinutes) {
      details.active = true;

      log.info("");
      log.info(c`game is {green Starting}!`);

      details.nextEventTime = addMinutes(
        this.calculateSimTime(),
        randomRangeInt(0, this._settings.chance as number)
      );
      log.info(
        c`next {yellow event} at {grey [{blue ${details.nextEventTime.toLocaleTimeString()}}]}`
      );
    }

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
