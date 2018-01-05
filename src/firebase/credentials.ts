import {
  credential as Credential,
  initializeApp,
  ServiceAccount
} from "firebase-admin";

import { databaseURL } from "./";
import { IFirebaseAuth } from "./IFirebaseAuth";

export * from "./IFirebaseAuth";

const FIREBASE_TEST_NODE = "/TEST";
const serviceAccountKeys = ["projectId", "clientEmail", "privateKey"];

export function validateSchema(data: object | ServiceAccount): boolean {
  const keys = Object.keys(data || {});
  return serviceAccountKeys.every(key => keys.includes(key));
}

export async function validateAuth(credentials: IFirebaseAuth) {
  try {
    const credential = Credential.cert(credentials as ServiceAccount);
    const testFirebase = initializeApp({ credential, databaseURL });

    const success = await testFirebase
      .database()
      .ref(FIREBASE_TEST_NODE)
      .once("value", snapshot => snapshot.val());
    return success;
  } catch (error) {
    return false;
  }
}
