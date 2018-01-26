import {
  DB_PATH_GAMES,
  DB_PATH_PLAYERS,
  DB_PATH_SIMULATION,
  DB_PATH_TEAMS,
  getOnce,
  remove,
  set,
  update
} from "../firebase/database";
import { ISportsFeedPlayer, ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import { deNormalizeSportsFeed } from "../sportsfeed/nhlTeams";
import { buildGames, ISimGame, normalizeGames } from "./game";
import { ISimulation } from "./ISimulation";
import { Looper } from "./looper";

export interface IDBTeams {
  [abbrev: string]: ISportsFeedTeam;
}

export interface IDBPlayers {
  [abbrev: string]: {
    [playerName: string]: ISportsFeedPlayer;
  };
}

export type ISimulationCallback = (value?: any) => void;

export class Simulation {
  public static async build(settings: ISimulation, doInit = true) {
    const instance = new Simulation({
      ...settings,
      started: false
    });
    if (doInit) {
      await instance.init();
    }
    return instance;
  }

  private _teams: ISportsFeedTeam[];
  private _games: ISimGame[];
  private _settings: ISimulation;
  private _isInit: boolean;
  private _wasStopped: boolean;
  private _looper: Looper;
  private _callback: ISimulationCallback;

  constructor(settings: ISimulation) {
    this._settings = settings;
  }

  public async init() {
    if (!this._isInit) {
      await set(DB_PATH_SIMULATION, this._settings);

      await this.fetchTeamsAndPlayers();
      await this.createGames();

      this._isInit = true;
    }
  }

  public get settings() {
    return this._settings;
  }

  public get teams() {
    return this._teams || [];
  }

  public get games() {
    return this._games || [];
  }

  public start(callback: ISimulationCallback) {
    if (!this._looper || !this._looper.active) {
      this._wasStopped = false;
      new Promise(async (resolve, reject) => {
        this._settings.started = true;
        this._settings.start = new Date();

        this._looper = new Looper(resolve);
        this._looper.start(this._settings, this._games);
        await update(DB_PATH_SIMULATION, this._settings);
      })
        .then((value: any) => !this._wasStopped && callback(value))
        .catch(err => {
          throw new Error(err);
        });
    }
  }

  public async restart(callback = this._callback) {
    await this.stop();
    await this.createGames();

    return this.start(callback);
  }

  public async stop() {
    if (this._looper && this._looper.active) {
      this._looper.destroy();
    }
    this._wasStopped = true;
    await remove(DB_PATH_SIMULATION);
    await remove(DB_PATH_GAMES);
  }

  private async fetchTeamsAndPlayers() {
    const results = await Promise.all([
      getOnce(DB_PATH_TEAMS) as Promise<IDBTeams>,
      getOnce(DB_PATH_PLAYERS) as Promise<IDBPlayers>
    ]);

    this._teams = deNormalizeSportsFeed({
      teams: results[0],
      players: results[1]
    });
  }

  private async createGames() {
    this._games = buildGames(this._teams, this.settings);
    await set(DB_PATH_GAMES, normalizeGames(this._games));
  }
}

export default Simulation;
