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
import { Loop } from "./loop";

export interface IDBTeams {
  [abbrev: string]: ISportsFeedTeam;
}

export interface IDBPlayers {
  [abbrev: string]: {
    [playerName: string]: ISportsFeedPlayer;
  };
}

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
  private _loop: Loop;

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

  public start() {
    if (!this._loop || !this._loop.active) {
      const promise = new Promise(async (resolve, reject) => {
        this._loop = new Loop(resolve);
        this._loop.start(this._settings, this._games);
        await this.updateStartData();
      });
      return promise;
    }
  }

  public async restart() {
    await this.stop();
    await this.createGames();

    return this.start();
  }

  public async stop() {
    if (this._loop && this._loop.active) {
      this._loop.destroy();
    }
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

  private async updateStartData() {
    const data: ISimulation = { started: true, start: new Date() };
    await update(DB_PATH_SIMULATION, data);
  }
}

export default Simulation;
