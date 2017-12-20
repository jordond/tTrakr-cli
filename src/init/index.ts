import { Argv, CommandModule } from "yargs";

import handler from "./init.handler";

declare global {
  export interface ICommandOptions {
    login?: string;
    password?: string;
    out?: string;
    limit?: number;
    random?: boolean;
  }
}

const init: CommandModule = {
  handler,
  command: "init [options]",
  describe: "Create config file for use with this tool",
  builder: (yargs: Argv) => {
    return yargs
      .options("auth", {
        alias: ["a", "accountAuth"],
        type: "string",
        desc: "Path to your firebase service account key JSON file"
      })
      .example(
        "$0 init --auth ./tmp/serviceAccountKey.json",
        "Prompts for login credentials then generates the json file in the specified location"
      );
  }
};

export default init;
