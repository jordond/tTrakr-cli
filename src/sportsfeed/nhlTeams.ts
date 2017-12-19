export const teamMap = {
  "Anaheim Ducks": "ANA",
  "Arizona Coyotes": "ARI",
  "Boston Bruins": "BOS",
  "Buffalo Sabres": "BUF",
  "Calgary Flames": "CGY",
  "Carolina Hurricanes": "CAR",
  "Chicago Blackhawks": "CHI",
  "Colorado Avalanche": "COL",
  "Columbus Blue Jackets": "CBJ",
  "Dallas Stars": "DAL",
  "Detroit Red Wings": "DET",
  "Edmonton Oilers": "EDM",
  "Florida Panthers": "FLO",
  "Los Angeles Kings": "LAK",
  "Minnesota Wild": "MIN",
  "Montreal Canadiens": "MTL",
  "Nashville Predators": "NSH",
  "New Jersey Devils": "NJD",
  "New York Islanders": "NYI",
  "New York Rangers": "NYR",
  "Ottawa Senators": "OTT",
  "Philadelphia Flyers": "PHI",
  "Pittsburgh Penguins": "PIT",
  "San Jose Sharks": "SJS",
  "St. Louis Blues": "STL",
  "Tampa Bay Lightning": "TBL",
  "Toronto Maple Leafs": "TOR",
  "Vancouver Canucks": "VAN",
  "Washington Capitals": "WSH",
  "Winnipeg Jets": "WPJ"
} as any;

export function validateTeam(nameOrAbbrev: string): boolean {
  return Boolean(ensureAbbrev(nameOrAbbrev));
}

export function ensureAbbrev(nameOrAbbrev: string): string {
  if (teamMap[nameOrAbbrev]) {
    return teamMap[nameOrAbbrev];
  }
  return Object.values(teamMap).find(x => nameOrAbbrev === x);
}
