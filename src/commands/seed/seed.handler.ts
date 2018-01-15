import c from "chalk";
import { ServiceAccount } from "firebase-admin";
import { resolve } from "path";

import { validateAuth, validateSchema } from "../../firebase/credentials";
import { validateSportsFeedCredentials } from "../../sportsfeed/index";
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

  const { sportsfeed = {}, firebase } = config.config;

  // Step 1: Validate the data file
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
  const formattedData = data.reduce(
    (prev, curr: ISportsFeedTeam) => {
      const { players, ...team } = curr;
      return {
        teams: {
          [team.name]: team,
          ...prev.teams
        },
        players: {
          [team.abbreviation]: players,
          ...prev.players
        }
      };
    },
    { teams: [], players: [] }
  );

  log.info("test: ", formattedData);
}
