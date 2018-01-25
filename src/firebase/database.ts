import { database } from "firebase-admin";

import { firebase } from "./";

export const DB_PATH_SIMULATION = "/simulation";
export const DB_PATH_GAMES = `/games`;
export const DB_PATH_TEAMS = "/teams";
export const DB_PATH_PLAYERS = "/players";

export function ref(path: string = "/"): database.Reference {
  return firebase()
    .database()
    .ref(path);
}

export function set(path: string = "/", data: any) {
  return ref(path).set(data);
}

export function update(path: string = "/", data: any) {
  return ref(path).update(data);
}

export async function getOnce(path: string = "/") {
  const result = await ref(path).once("value");
  return result.val();
}

export function remove(path: string) {
  if (!path) {
    throw new Error("database:remove -> No path was supplied");
  }
  return ref(path).remove();
}
