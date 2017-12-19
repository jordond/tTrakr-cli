export interface ISportsFeedPlayers {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: string;
  postition: string;
  height: string;
  weight: string;
  birthCity: string;
  birthCountry: string;
  isRookie: string;
}

export interface ISportsFeedTeam {
  abbreviation: string;
  name: string;
  formed: string;
  home: {
    stadium: string;
    location: string;
    thumbnail: string | null;
  };
  description: string;
  images: {
    badge: string | null;
    jersey: string | null;
    logo: string | null;
  };
  players?: ISportsFeedPlayers;
}
