import c from "chalk";
import {
  credential as Credential,
  initializeApp,
  ServiceAccount
} from "firebase-admin";

import Logger from "../utils/logger";
import { timeoutPromise } from "../utils/misc";
import { databaseURL } from "./";

const FIREBASE_TEST_NODE = "/TEST";
const serviceAccountKeys = ["project_id", "client_email", "private_key"];

export function validateSchema(data: object | ServiceAccount): boolean {
  const keys = Object.keys(data || {});
  return serviceAccountKeys.every(key => keys.includes(key));
}

export async function validateAuth(credentials: ServiceAccount) {
  const log = new Logger(c`{red Firebase}`);
  try {
    const credential = Credential.cert(credentials);
    const testFirebase = initializeApp({ credential, databaseURL });

    const result: boolean = await timeoutPromise(
      testFirebase
        .database()
        .ref(FIREBASE_TEST_NODE)
        .once("value", snapshot => Boolean(snapshot.val()))
    );

    return result;
  } catch (error) {
    log.debug(c`firebase auth error: {red ${error}}`);
    return false;
  }
}
