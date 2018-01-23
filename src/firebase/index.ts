import {
  app,
  credential as Credential,
  initializeApp,
  ServiceAccount
} from "firebase-admin";

export const databaseURL = "https://ttrakr-0.firebaseio.com";

let firebaseInstance: app.App;
let creds: ServiceAccount;

export function init(credentials: ServiceAccount): app.App {
  if (!firebaseInstance) {
    const credential = Credential.cert(credentials);
    firebaseInstance = initializeApp({ credential, databaseURL });
    creds = credentials;
  }
  return firebaseInstance;
}

export function firebase(credentials?: ServiceAccount) {
  if (credentials) {
    creds = credentials;
  }
  return init(creds);
}
