import {
  DB_PATH_GAMES,
  DB_PATH_PLAYERS,
  DB_PATH_SIMULATION,
  DB_PATH_TEAMS,
  getOnce,
  remove,
  set
} from "../firebase/database";
import { ISportsFeedPlayer, ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import { deNormalizeSportsFeed } from "../sportsfeed/nhlTeams";
import { uuid } from "../utils/misc";
import { buildGames, ISimGame, normalizeGames } from "./game";
import { ISimulation } from "./ISimulation";

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
      started: false,
      id: uuid()
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

  public async stop() {
    await remove(DB_PATH_SIMULATION);
    await remove(`/${this.settings.id}`);
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
    await set(`/${this.settings.id}`, normalizeGames(this._games));
  }
}

export default Simulation;
