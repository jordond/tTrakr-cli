import c from "chalk";
import { ServiceAccount } from "firebase-admin";
import { Question } from "inquirer";

import { save } from "../config/config";
import { validateAuth, validateSchema } from "../firebase/credentials";
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

  const gaveUp = () => c`:( seems like you {red gave up}...`;

  log.info(c`lets build ourself a {blue config} file!`);
  const sportsfeed = await getSportsfeedCredentials();
  if (isEmpty(sportsfeed)) {
    return gaveUp();
  }

  const firebase = await getFirebaseCredentialsJSON();
  if (isEmpty(firebase)) {
    return gaveUp();
  }

  // Save the config and return the status message
  const statusMessage: string = await saveConfigFile({ sportsfeed, firebase });
  return statusMessage;
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

async function getSportsfeedCredentials(): Promise<ISportsFeedCreds> {
  const log = new Logger(TAG);
  const sportsfeed: ISportsFeedCreds = await askForCredentials(
    {},
    "http://www.mysportsfeed.com",
    log
  );
  const isValid = await validateSportsFeedCredentials(sportsfeed, log, false);
  if (!isValid) {
    log.warning("would you like to try again?");
    if (await confirmContinue(c`try {yellow again}`, true)) {
      return getSportsfeedCredentials();
    }
    return {};
  }
  log.info(c`was {yellow super} valid, way to go champ ❤️`);
  return sportsfeed;
}

async function getFirebaseCredentialsJSON(): Promise<ServiceAccount> {
  const log = new Logger(TAG);
  log.info(c`you now need to enter your {cyan firebase-admin} credentials`);
  log.info(c`an {green editor} should open, then paste your credentials`);
  log.info(
    c`if you don't have your credentials download from {blue https://goo.gl/tdVGvS}`
  );

  const firebaseCredentials = await prompt({
    type: "editor",
    name: "firebase",
    message: " "
  });

  log.info(c`validating the {blue credentials}`);
  if (!validateSchema(firebaseCredentials)) {
    log.warning(c`credentials did not match the {magenta schema}`);
    if (await confirmContinue("try again?")) {
      return getFirebaseCredentialsJSON();
    }
  }
  log.debug(c`looks like a {green valid} credential file to me! {cyan :)}`);

  log.info(c`trying to {green authenticate} with {cyan firebase}`);
  if (!await validateAuth(firebaseCredentials)) {
    log.warning(c`:(... unable to {blue authenticate}! }`);
    if (await confirmContinue("try again?")) {
      return getFirebaseCredentialsJSON();
    }
  }
  log.info(
    c`{green success!}, looks like {cyan firebase} likes you {magenta ;)}`
  );

  return firebaseCredentials as ServiceAccount;
}

async function saveConfigFile(data: any) {
  const log = new Logger(TAG);

  const newConfig = { ...data };
  log.info(c`lets {green save} this config file!`);
  log.info(c`how does it {cyan look} ?`, newConfig);
  if (await confirmContinue(c`{magenta save?}`, true)) {
    const savePath = await save(newConfig);
    if (savePath) {
      log.info(c`{green success!} saved config to {magenta ${savePath}}`);
      return c`{blue we did it!}`;
    }
    return c`:( im not sure what happened... i was {yellow unable} to save`;
  }

  return c`:( saving config {red aborted}`;
}
