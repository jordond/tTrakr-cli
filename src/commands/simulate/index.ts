import { Argv, CommandModule } from "yargs";

import handler from "./simulate.handler";

declare global {
  export interface ICommandOptions {
    speedFactor?: number;
  }
}

const simulate: CommandModule = {
  handler,
  command: "simulate",
  aliases: "start",
  describe: "Begin the game simulation",
  builder: (yargs: Argv) => {
    return yargs
      .option("speedFactor", {
        alias: ["speed", "s"],
        desc: "Set the speed scale factor",
        type: "number",
        default: 0
      })
      .example(
        "$0 simulate",
        "Starts the simulation of hockey games, with regular time"
      )
      .example(
        "$0 simulate --speed 30",
        "Starts simulation with speed factor of 30, ie 1 Minute sim time = 1 Second real-time"
      );
  }
};

export default simulate;
