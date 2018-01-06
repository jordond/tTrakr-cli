import c from "chalk";
import { ServiceAccount } from "firebase-admin";
import { Question } from "inquirer";
import { resolve } from "path";

import { save } from "../config/config";
import { validateAuth, validateSchema } from "../firebase/credentials";
import { ISportsFeedCreds, validateSportsFeedCredentials } from "../sportsfeed";
import Logger from "../utils/logger";
import { isEmpty } from "../utils/misc";
import { askForCredentials, prompt } from "../utils/prompt";

const TAG = c`{blueBright INIT}`;

export default async function({ config = {}, ...argv }: ICommandOptions) {
  const log = new Logger(TAG);

  if (config.filepath) {
    log.info(c`😱  {cyanBright doh!}`);
    log.info(c`it looks like a config file {red already} exists! 🤡`);
    log.info(c`{cyan ${config.filepath}}`);
    if (!argv.force) {
      log.warning(
        "⚠️  if you continue I will overrite the current config file"
      );
      if (!await confirmContinue()) {
        return c`no work to do {yellow :)}`;
      }
    } else {
      log.warning(
        c`{red force} option is enabled, overwriting existing config`
      );
    }
  }

  const gaveUp = () => c`:( seems like you {red gave up}...`;

  log.info(c`lets build ourself a {blue config} file!`);

  log.info(c`{grey Step {green 1}: {cyan SportsFeed.com}}`);
  const { login, password } = argv;
  const sportsfeed = await getSportsfeedCredentials({ login, password });
  if (isEmpty(sportsfeed)) {
    return gaveUp();
  }

  log.info(c`{grey Step {magenta 2}: {red Firebase} authentication}`);
  const firebase = await getFirebaseCredentialsJSON(argv.auth);
  if (isEmpty(firebase)) {
    return gaveUp();
  }

  // Save the config and return the status message
  const statusMessage: string = await saveConfigFile(
    { sportsfeed, firebase },
    argv.force
  );
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

async function getSportsfeedCredentials(
  cred?: ISportsFeedCreds
): Promise<ISportsFeedCreds> {
  const log = new Logger(TAG);

  let sportsfeed: ISportsFeedCreds;
  if (cred && cred.login && cred.password) {
    log.debug(c`using {cyan passed in} credentials :)`);
    sportsfeed = { ...cred };
  } else {
    sportsfeed = await askForCredentials(
      cred || {},
      "http://www.mysportsfeed.com",
      log
    );
  }

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

async function getFirebaseCredentialsJSON(
  pathToCredentials?: string
): Promise<ServiceAccount> {
  const log = new Logger(TAG);

  let firebaseCredentials;
  if (pathToCredentials) {
    try {
      log.info(c`trying to read supplied {red firebase} {green credentials}`);
      log.debug(c`from -> {blue ${resolve(pathToCredentials)}}`);
      firebaseCredentials = require(resolve(pathToCredentials));
      log.info(c`{green good job!}, I found the file`);
    } catch (error) {
      log.e(c`Could not find or read {cyan ${pathToCredentials}} :(`);
    }
  }

  if (!firebaseCredentials) {
    log.info(
      c`{magenta you} need to enter your {cyan firebase-admin} credentials`
    );
    log.info(
      c`an {blue editor} should open, then {yellow paste} your credentials`
    );
    log.info(
      c`if you don't have your {green credentials} download from {blue https://goo.gl/tdVGvS}`
    );
    firebaseCredentials = await prompt({ type: "editor", name: "firebase" });
  }

  const confirmOrReturn = async () =>
    (await confirmContinue("try again?")) ? getFirebaseCredentialsJSON() : {};

  log.info(c`validating the {blue credentials}`);
  if (!validateSchema(firebaseCredentials)) {
    log.warning(c`credentials did not match the {magenta schema}`);
    return confirmOrReturn();
  }
  log.debug(c`looks like a {green valid} credential file to me! {cyan :)}`);

  log.info(c`trying to {green authenticate} with {cyan firebase}`);
  if (!await validateAuth(firebaseCredentials)) {
    log.warning(c`:(... unable to {blue authenticate}!`);
    return confirmOrReturn();
  }
  log.info(
    c`{green success!}, looks like {cyan firebase} likes you {magenta ;)}`
  );

  return firebaseCredentials as ServiceAccount;
}

async function saveConfigFile(data: any, forceSave: boolean = false) {
  const log = new Logger(TAG);

  const newConfig = { ...data };
  log.info(c`lets {green save} this config file!`);
  log.info(c`how does it {cyan look} ?`, newConfig);
  if (forceSave || (await confirmContinue(c`{magenta save?}`, true))) {
    const savePath = await save(newConfig);
    if (savePath) {
      log.info(c`{green success!} saved config to {magenta ${savePath}}`);
      log.info(c`{yellow DO NOT} add this file to {green source} control!`);
      return c`{blue we did it!}`;
    }
    return c`:( im not sure what happened... i was {yellow unable} to save`;
  }

  return c`:( saving config was {red aborted}`;
}
