import { ISimGame } from "./game";
import { ISimulation } from "./ISimulation";
import { simMinuteToRealMillis } from "./time";

export class Loop {
  public active: boolean = false;

  private _resolve: (value?: any) => void;
  private _interval: NodeJS.Timer | null;
  private _temp: number = 0;

  constructor(resolve: (value: any) => void) {
    this._resolve = resolve;
  }

  public start(settings: ISimulation, games: ISimGame[]) {
    if (!this.active && !this._interval) {
      const oneSimMinute = simMinuteToRealMillis(settings.factor);

      this._interval = setInterval(
        () => this.loop(settings, games),
        oneSimMinute
      );
      this.active = true;
    }
  }

  public destroy() {
    if (this.active && this._interval) {
      clearInterval(this._interval);
      this.active = false;
      this._interval = null;
    }
  }

  private loop(settings: ISimulation, games: ISimGame[]) {
    // TODO LOOP
    this._temp += 1;
    if (this._temp === 10) {
      this.destroy();
      this._resolve();
    }
  }
}
