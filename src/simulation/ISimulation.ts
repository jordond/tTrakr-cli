export interface ISimulation {
  started?: boolean;
  start?: Date;
  factor?: number;
  chance?: number;
  maxGames?: number;
  startRange?: number;
}

export default ISimulation;
