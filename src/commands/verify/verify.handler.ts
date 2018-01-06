import c from "chalk";

import Logger from "../../utils/logger";

const TAG = c`{green VERIFY}`;

export default async function({ config = {} }: ICommandOptions) {
  const log = new Logger(TAG);

  if (!config.filepath) {
    log.warning(c`😱  {cyanBright doh!}`);
    log.info(c`I {red couldn't} find a {green .ttrackrrc}`);
    log.info(c`{blue create} a config file using {cyan 'tkr init'}`);
    log.info(c`or use the {magenta '--configPath'} options`);
    throw new Error("Couldn't find '.ttrakrrc'");
  }

  return c`{magenta TODO}`;
}
