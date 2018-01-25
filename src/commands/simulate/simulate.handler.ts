import c from "chalk";

import { clearInterval } from "timers";
import { verifyConfig } from "../../index";
import { exit } from "../../middleware";
import { Simulation } from "../../simulation/simulation";
import { simMinuteToRealMillis } from "../../simulation/time";
import Logger from "../../utils/logger";
import { flatten } from "../../utils/misc";
import { length } from "../../utils/object";

const TAG = c`{yellow Sim}`;

export default async function({
  config = {},
  factor = 0,
  chance,
  maxGames,
  startRange,
  ...argv
}: ICommandOptions) {
  const log = new Logger(TAG);

  verifyConfig(config);

  if (factor !== 0) {
    log.debug(c`using {bold speed} factor {cyan ${factor as any}}`);
  }
  log.info(
    c`1 {green sim-Time} minute is equal to {blue ${(simMinuteToRealMillis(
      factor
    ) / 1000) as any}} {green real-time} seconds`
  );

  // Init simulation
  const simulation = await Simulation.build({
    factor,
    chance,
    maxGames,
    startRange
  });
  const players = flatten(simulation.teams.map(x => x.players)).length;

  log
    .debug(c`using {cyan settings}`, simulation.settings)
    .info(c`found {blue ${length(simulation.teams) as any}} teams`)
    .info(c`found {cyan ${players as any}} players`);

  // Build the games
  // Team VS Team
  // use max limit => -1 === unlimited

  // Start the simulation
  // Check if game needs to start
  // start game

  // All games are finished
  // DEFAULT -> restart simulation, with different games
  // Stop completely

  // Set listeners for the database events
  // simulation started
  // game started
  // new period
  // new goal
  // new penalty
  // game finished
  // all games finished
  setTimeout(() => {
    simulation.stop();
    exit();
  }, 10000);
}
