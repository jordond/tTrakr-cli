import c from "chalk";

import { verifyConfig } from "../../index";
import Logger from "../../utils/logger";

const TAG = c`{yellow Seed}`;

export default async function({ config = {}, ...argv }: ICommandOptions) {
  const log = new Logger(TAG);

  verifyConfig(config);

  log.info("Hey");

  return c`{green todo}`;
}
