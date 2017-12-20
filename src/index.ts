import chalk from "chalk";
import * as yargs from "yargs";

import commands from "./commands";
import Logger from "./utils/logger";

declare global {
  export interface ICommandOptions {
    saveConfig?: boolean;
    configPath?: string;
    noConfig?: boolean;
    version?: boolean;
  }
}

const TAG = chalk.magenta("tTrakr");

export function start(): yargs.Arguments | undefined {
  new Logger(TAG).info("😊  Welcome to tTrakr!");

  try {
    const yargsInstance = commands
      .reduce((prev, curr) => prev.command(curr), yargs)
      .demandCommand(1, "You must enter a command")
      .option("save-config", {
        alias: "S",
        desc: "Save config information to a file for future use"
      })
      .option("config", {
        alias: ["c", "config-path"],
        desc: "Path to the config file, if omitted will search for it"
      })
      .option("noConfig", { desc: "Do not use a config file at all" })
      .help()
      .alias("help", "h")
      .version()
      .alias("version", "V")
      .strict().argv;

    return yargsInstance;
  } catch (error) {
    process.exit(1);
  }
}

export function exit(code: number = 0, message: string = ""): void {
  const log = new Logger(TAG);
  if (code > 0) {
    log.error("😟  Exiting with failure");
    if (message) {
      log.error(message);
    }
  }
  process.exit(code);
}
