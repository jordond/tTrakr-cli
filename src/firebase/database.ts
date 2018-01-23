import { ISportsFeedPlayer, ISportsFeedTeam } from "../sportsfeed/ISportsFeed";
import { firebase } from "./";

export function normalizeSportsFeed(data: ISportsFeedTeam[]) {
  return data.reduce(
    (prev, curr: ISportsFeedTeam) => {
      const { players = [], ...team } = curr;
      const normalizedPlayers = players.reduce(
        (p, c) => ({
          [createPlayerKey(c)]: c,
          ...p
        }),
        {}
      );

      return {
        teams: {
          [team.abbreviation]: team,
          ...prev.teams
        },
        players: {
          [team.abbreviation]: normalizedPlayers,
          ...prev.players
        }
      };
    },
    { teams: [], players: [] }
  );
}

export function push(path: string = "/", data: any) {
  const ref = firebase()
    .database()
    .ref(path);
  return ref.set(data);
}

function createPlayerKey({ firstName, lastName }: ISportsFeedPlayer) {
  return `${firstName.charAt(0)}${lastName}`.toLowerCase();
}
