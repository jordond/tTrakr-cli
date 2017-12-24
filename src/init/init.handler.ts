import chalk from "chalk";

import Logger from "../utils/logger";

const TAG = chalk.blueBright("INIT");

export default async function({ config }: ICommandOptions) {
  const log = new Logger(TAG);

  log.info(chalk`{green T} {blue O} {yellow D} {red O}`);

  return chalk`{inverse shoop}`;
}
