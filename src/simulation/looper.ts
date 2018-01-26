import { ISimGame } from "./game";
import { ISimulation } from "./ISimulation";
import { simMinuteToRealMillis } from "./time";

export class Looper {
  public active: boolean = false;

  private _resolve: (value?: any) => void;
  private _interval: NodeJS.Timer | null;

  private _settings: ISimulation;
  private _games: ISimGame[];
  private _finishedGames: ISimGame[];
  private _time: number = 0.0;
  private _minutes: number = 0;

  constructor(resolve: (value: any) => void) {
    this._resolve = resolve;
  }

  public start(settings: ISimulation, games: ISimGame[]) {
    if (!this.active && !this._interval) {
      const oneSimMinute = simMinuteToRealMillis(settings.factor);
      this._settings = settings;
      this._games = games;
      this._interval = setInterval(this.loop, oneSimMinute);
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
    this._time += 0.01;
    this._minutes += 1;

    const activeGames = this._games.slice().filter(this.processGame);

    if (this._time === 10) {
      this.destroy();
    }
  }

  private processGame(game: ISimGame, index: number): boolean {
    return true; // Still active
  }

  private allGamesFinished(totalGames: number): boolean {
    return totalGames === this._finishedGames.length;
  }
}
