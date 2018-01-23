import c from "chalk";

import { scaleMinsToSeconds } from "../../game/time";
import { verifyConfig } from "../../index";
import Logger from "../../utils/logger";

const TAG = c`{yellow Seed}`;

export default async function({
  config = {},
  speedFactor = 0,
  ...argv
}: ICommandOptions) {
  const log = new Logger(TAG);

  verifyConfig(config);

  log
    .info(c`using speed factor {cyan ${speedFactor as any}}`)
    .info(
      c`1 {green Sim-Time} minute is equal to {blue ${scaleMinsToSeconds(
        speedFactor
      ) as any}} {green real-time} seconds`
    );

  return c`{green todo}`;
}
