import chalk from "chalk";
import * as yargs from "yargs";
import { ICosmicConfig } from "./config/config";

import commands from "./commands";
import { addMiddleware, exit } from "./middleware";

declare global {
  export interface ICommandOptions {
    config: ICosmicConfig;
    saveConfig?: boolean;
    configPath?: string;
    noConfig?: boolean;
    version?: boolean;
    silent?: boolean;
    verbose?: boolean;
  }
}

export const TAG = chalk.magenta("tTrakr");

export function start(): yargs.Arguments | undefined {
  try {
    const yargsInstance = commands
      .map(addMiddleware)
      .reduce((yarg, command) => yarg.command(command), yargs)
      .demandCommand(1, "You must enter a command")
      .option("save-config", {
        alias: "S",
        desc: "Save config information to a file for future use"
      })
      .option("config-path", {
        alias: "c",
        desc:
          "Path to the folder containing the config file, if omitted will search for the CWD"
      })
      .option("noConfig", { desc: "Do not use a config file at all" })
      .option("verbose", {
        alias: "v",
        type: "boolean",
        desc: "Log ALL the things"
      })
      .option("silent", { type: "boolean", desc: "Only log errors" })
      .help()
      .alias("help", "h")
      .version()
      .alias("version", "V")
      .strict().argv;

    return yargsInstance;
  } catch (error) {
    exit(1, error);
  }
}
