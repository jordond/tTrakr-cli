import { Argv, CommandModule } from "yargs";

import handler from "./seed.handler";

declare global {
  export interface ICommandOptions {
    data?: string;
  }
}

const seed: CommandModule = {
  handler,
  command: "seed [options] <data>",
  describe: "Seed Firebase with Player and team data",
  builder: (yargs: Argv) => {
    return yargs.example(
      "$0 seed ./data/teams.json",
      "Seed the Firebase database with data.  Use 'tkr generate' to create a data file."
    );
  }
};

export default seed;
