import c from "chalk";
import { ServiceAccount } from "firebase-admin";

import Logger from "../utils/logger";
import { timeoutPromise } from "../utils/misc";
import { init } from "./";

const FIREBASE_TEST_NODE = "/TEST";
const serviceAccountKeys = ["project_id", "client_email", "private_key"];

export function validateSchema(data: object | ServiceAccount): boolean {
  const keys = Object.keys(data || {});
  return serviceAccountKeys.every(key => keys.includes(key));
}

export async function validateAuth(credentials: ServiceAccount) {
  const log = new Logger(c`{red Firebase}`);
  try {
    const testFirebase = init(credentials);

    const result: boolean = await timeoutPromise(
      testFirebase
        .database()
        .ref(FIREBASE_TEST_NODE)
        .once("value", snapshot => Boolean(snapshot.val())),
      15 * 1000
    );

    return result;
  } catch (error) {
    log.debug(c`firebase auth error: {red ${error}}`);
    return false;
  }
}

export async function validate(credentials: ServiceAccount) {
  return validateSchema(credentials) && validateAuth(credentials);
}
