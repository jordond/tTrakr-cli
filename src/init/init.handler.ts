import c from "chalk";
import { Question } from "inquirer";

import { save } from "../config/config";
import { ISportsFeedCreds, validateSportsFeedCredentials } from "../sportsfeed";
import Logger from "../utils/logger";
import { isEmpty } from "../utils/misc";
import { askForCredentials, prompt } from "../utils/prompt";

const TAG = c`{blueBright INIT}`;

export default async function({ config = {} }: ICommandOptions) {
  const log = new Logger(TAG);

  if (config.filepath) {
    log.info(c`😱  {cyanBright doh!}`);
    log.info(c`it looks like a config file {red already} exists! 🤡`);
    log.info(c`{cyan ${config.filepath}}`);
    log.warning("⚠️  if you continue I will overrite the current config file");
    if (!await confirmContinue()) {
      return c`no work to do {yellow :)}`;
    }
  }

  log.info(c`lets build ourself a {blue config} file!`);
  const sportsfeed = await getSportsfeedCredentials(log);
  if (isEmpty(sportsfeed)) {
    return c`:( seems like you {red gave up}...`;
  }

  const newConfig = { sportsfeed };
  log.info(c`lets {green save} this config file!`);
  log.info(c`how does it {cyan look} 👀?`, newConfig);
  if (await confirmContinue(c`{magenta save?}`, true)) {
    const savePath = await save(newConfig);
    if (savePath) {
      log.info(c`{green success!} saved config to {magenta ${savePath}}`);
      return c`{blue we did it!}`;
    }
    return c`:( im not sure what happened... i was {yellow unable} to save`;
  }

  return c`:( {red aborted}`;
}

async function confirmContinue(
  message?: string,
  defaultOption: boolean = false
) {
  try {
    const question: Question = {
      name: "continue",
      type: "confirm",
      message: message || "continue:",
      default: defaultOption
    };
    const result = await prompt(question);
    return result.continue;
  } catch (error) {
    return false;
  }
}

async function getSportsfeedCredentials(
  log: Logger
): Promise<ISportsFeedCreds> {
  const sportsfeed: ISportsFeedCreds = await askForCredentials(
    {},
    "http://www.mysportsfeed.com",
    log
  );
  const isValid = await validateSportsFeedCredentials(sportsfeed, log, false);
  if (!isValid) {
    log.warning("would you like to try again?");
    if (await confirmContinue(c`try {yellow again}`, true)) {
      return getSportsfeedCredentials(log);
    }
    return {};
  }
  log.info(c`was {yellow super} valid, way to go champ ❤️`);
  return sportsfeed;
}
