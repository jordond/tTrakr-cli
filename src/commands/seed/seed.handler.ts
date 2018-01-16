import c from "chalk";
import { resolve } from "path";

import { validateSchema } from "../../firebase/credentials";
import { normalizeSportsFeed } from "../../firebase/database";
import { ISportsFeedTeam } from "../../sportsfeed/ISportsFeed";
import Logger from "../../utils/logger";
import { isEmpty } from "../../utils/misc";

const TAG = c`{yellow Seed}`;

export default async function({ config = {}, ...argv }: ICommandOptions) {
  const log = new Logger(TAG);

  if (!argv.data) {
    throw new Error("Path to data file needs to be supplied!");
  }

  if (!config.filepath || (!config.config || isEmpty(config.config))) {
    log.info(c`I {red couldn't} find a {green .ttrackrrc}`);
    log.info(c`{blue create} a config file using {cyan 'tkr init'}`);
    log.info(c`or use the {magenta '--configPath'} options`);
    throw new Error("Couldn't find '.ttrakrrc'");
  }

  let data: ISportsFeedTeam[];
  try {
    log.info(c`I am going to {yellow attempt} to validate {blue ${argv.data}}`);

    const resolvedPath = resolve(argv.data);
    log.debug(c`resolves to {cyan ${resolvedPath}}`);

    data = require(resolvedPath);
    if (data) {
      validateSchema(data);
    }
  } catch (error) {
    log.info(
      c`:( the file you passed me was {red invalid} or {red missing}, try running {blue 'tkr generate'} again`
    );
    throw error;
  }

  log.info(c`{green :)} the data looks {cyan good}, let's do this!`);

  // Step 2: Push it to Firebase

  // Build the data structure
  const { teams, players } = normalizeSportsFeed(data);

  log.info(
    c`pushing {green ${String(Object.keys(teams).length)}} to {red firebase}`
  );

  log.info(
    c`pushing {green ${String(Object.keys(players).length)}} to {red firebase}`
  );
}
