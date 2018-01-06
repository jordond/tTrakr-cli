import { Argv, CommandModule } from "yargs";

import handler from "./init.handler";

declare global {
  export interface ICommandOptions {
    auth?: string;
    force?: boolean;
    login?: string;
    password?: string;
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
      .options("force", {
        alias: "f",
        type: "boolean",
        desc: "Ignore file overwrite prompts"
      })
      .options("login", {
        alias: ["l", "u", "username"],
        type: "string",
        desc: "Login name for mysportsfeeds.com"
      })
      .options("password", {
        alias: "p",
        type: "string",
        desc: "Password for mysportsfeeds.com"
      })
      .example(
        "$0 init --auth ./tmp/serviceAccountKey.json",
        "Prompts for login credentials then generates the json file in the specified location"
      );
  }
};

export default init;
