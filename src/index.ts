import * as yargs from "yargs";

import commands from "./commands";

declare global {
  export interface ICommandOptions {
    version?: boolean;
    verbose?: boolean;
  }
}

export function start(): yargs.Arguments {
  const yargsInstance = commands.reduce(
    (prev, curr) => prev.command(curr),
    yargs
  );

  return yargsInstance
    .demandCommand(1, "You must enter a command")
    .option("verbose", { alias: "v", desc: "Output all the things" })
    .help()
    .alias("help", "h")
    .version()
    .alias("version", "V")
    .strict().argv;
}
