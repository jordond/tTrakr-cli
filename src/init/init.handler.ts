import c from "chalk";

import Logger from "../utils/logger";

const TAG = c`{blueBright INIT}`;

export default async function({ config }: ICommandOptions) {
  const log = new Logger(TAG);

  log.info(c`{green T} {blue O} {yellow D} {red O}`);

  log.info(c`lets build ourself a {blue config} file!`);
  log.info(c`select `);
}
