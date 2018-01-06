import { Argv, CommandModule } from "yargs";

import handler from "./verify.handler";

declare global {
  export interface ICommandOptions {
    nothing?: boolean;
  }
}

const verify: CommandModule = {
  handler,
  command: "verify [options]",
  describe: "Verify the config file",
  builder: (yargs: Argv) => {
    return yargs.example(
      "$0 verify",
      "Verifies the .ttrackrrc file, ensures everything is in working order"
    );
  }
};

export default verify;
