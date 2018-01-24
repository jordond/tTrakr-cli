import c from "chalk";

import { verifyConfig } from "../../index";
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

  const simulation = await Simulation.build({ factor, chance, maxGames });
  log.info(c`fetched {blue ${length(simulation.teams) as any}} teams`);

  const players = Object.values(simulation.players).map(x => Object.values(x));
  log.info(c`fetched {cyan ${flatten(players).length as any}} players`);

  return c`{green todo}`;
}
