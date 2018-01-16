import { ISportsFeedTeam } from "../sportsfeed/ISportsFeed";

export function normalizeSportsFeed(data: ISportsFeedTeam[]) {
  return data.reduce(
    (prev, curr: ISportsFeedTeam) => {
      const { players, ...team } = curr;
      return {
        teams: {
          [team.name]: team,
          ...prev.teams
        },
        players: {
          [team.abbreviation]: players,
          ...prev.players
        }
      };
    },
    { teams: [], players: [] }
  );
}
