import { DB_PATH_PLAYERS, DB_PATH_TEAMS, getOnce } from "../firebase/database";
import { ISportsFeedPlayer, ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
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
  public static async build(settings: ISimulation, fetchData = true) {
    const instance = new Simulation(settings);
    if (fetchData) {
      await instance.fetchData();
    }
    return instance;
  }

  public teams: IDBTeams;
  public players: IDBPlayers;

  // TODO use settings
  // tslint:disable-next-line
  private settings: ISimulation;

  constructor(settings: ISimulation) {
    this.settings = settings;
  }

  public fetchData() {
    return Promise.all([this.getTeams(), this.getPlayers()]);
  }

  private async getTeams() {
    this.teams = await getOnce(DB_PATH_TEAMS);
  }

  private async getPlayers() {
    this.players = await getOnce(DB_PATH_PLAYERS);
  }
}

export default Simulation;
