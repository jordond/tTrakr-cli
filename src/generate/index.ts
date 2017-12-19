import { Argv, CommandModule } from "yargs";

import handler from "./gen.handler";

declare global {
  export interface ICommandOptions {
    login?: string;
    password?: string;
    output?: string;
    savedCredentials?: boolean;
  }
}

const generate: CommandModule = {
  handler,
  command: "generate [options]",
  describe:
    "generate a JSON file containing data about all the NHL teams and players.  This requires an account at www.mysportsfeeds.com.  You can enter your login details as parameters, but it is recommended to let the interactive mode handle it.",
  builder: (yargs: Argv) => {
    return yargs
      .options("login", {
        alias: ["l", "u"],
        type: "string",
        desc: "Login name for mysportsfeeds.com"
      })
      .options("password", {
        alias: "p",
        type: "string",
        desc: "Password for mysportsfeeds.com"
      })
      .options("savedCredentials", {
        type: "boolean",
        default: true,
        desc: "Saves the login credentials to the temp folder"
      })
      .options("out", {
        alias: "o",
        type: "string",
        default: "./",
        desc: "Path to save the created JSON file"
      })
      .example(
        "$0 generate --out ./tmp/list.json",
        "Prompts for login credentials then generates the json file in the specified location"
      )
      .example(
        "$0 generate --login foo --password bar",
        "Uses the passed in credentials, will override any saved credentials"
      )
      .example(
        "$0 generate --no-saved-credentials",
        "Ignore the saved credentials from previous runs"
      );
  }
};

export default generate;
