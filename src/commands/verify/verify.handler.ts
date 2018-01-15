import c from "chalk";
import { ServiceAccount } from "firebase-admin";

import { validateAuth, validateSchema } from "../../firebase/credentials";
import { validateSportsFeedCredentials } from "../../sportsfeed/index";
import Logger from "../../utils/logger";
import { isEmpty } from "../../utils/misc";

const TAG = c`{green VERIFY}`;

export default async function({ config = {} }: ICommandOptions) {
  const log = new Logger(TAG);

  if (!config.filepath || (!config.config || isEmpty(config.config))) {
    log.warning(c`😱  {cyanBright doh!}`);
    log.info(c`I {red couldn't} find a {green .ttrackrrc}`);
    log.info(c`{blue create} a config file using {cyan 'tkr init'}`);
    log.info(c`or use the {magenta '--configPath'} options`);
    throw new Error("Couldn't find '.ttrakrrc'");
  }

  const { sportsfeed = {}, firebase } = config.config;

  // Step 1: Validate SportsFeed Credentials
  log.info(c`{grey Step {cyan 1}: SportsFeed}`);
  const spValid = await validateSportsFeedCredentials(sportsfeed, log, false);
  if (spValid) {
    log.info(c`:) wooo! {green SportsFeed} looks {yellow good}!`);
  }

  // Step 2: validay firebase credentials
  let fbValid = true;
  log.info(c`{grey Step {magenta 2}: {bold {red Fire}{blue Base}}}`);

  log.info(c`validating the {yellow schema}...`);
  if (!validateSchema(firebase as ServiceAccount)) {
    log.error("Schema verification failed...");
    fbValid = false;
  }

  log.info(c`checking the {blue credentials} with firebase...`);
  if (!await validateAuth(firebase as ServiceAccount)) {
    log.error("Firebase didn't like your credentials...");
    log.info(
      c`download new {green credentials} from {blue https://goo.gl/tdVGvS}`
    );
    fbValid = false;
  }

  if (fbValid) {
    log.info(c`{green yay!} I {bold knew} you could do it {cyan :)}`);
  }

  // Make sure all checks passed
  if ([spValid, fbValid].every(x => x)) {
    return c`{magenta VALID!}  you have {bold {blue FULL}} access {bold ;)}`;
  }

  throw new Error(
    "One or more of the verifications failed... Try running the 'init' command again!"
  );
}
