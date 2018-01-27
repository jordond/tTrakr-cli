import { Argv, CommandModule } from "yargs";

import handler from "./simulate.handler";

declare global {
  export interface ICommandOptions {
    factor?: number;
    maxGames?: number;
    chance?: number;
    startRange?: number;
    restart?: boolean;
  }
}

const simulate: CommandModule = {
  handler,
  command: "simulate",
  aliases: "start",
  describe: "Begin the game simulation",
  builder: (yargs: Argv) => {
    return yargs
      .option("factor", {
        alias: ["speed", "s", "speedFactor"],
        desc: "Set the speed scale factor, 1 is real-time",
        type: "number",
        default: 1
      })
      .option("maxGames", {
        alias: ["max", "m"],
        desc: "Max number of games to allow",
        type: "number",
        default: -1
      })
      .option("chance", {
        alias: "c",
        desc: "The likelyhood of events happening, lower = more events",
        type: "number",
        default: 5
      })
      .option("startRange", {
        alias: "range",
        desc: "The range in which games will start, higher = less frequent",
        type: "number",
        default: 500
      })
      .option("restart", {
        desc: "Auto restart simulation after all games are finished",
        type: "boolean",
        default: true
      })
      .example(
        "$0 simulate",
        "Starts the simulation of hockey games, with regular time"
      )
      .example(
        "$0 simulate --no-restart",
        "Only runs one simulation, instead of continuing after all games are done"
      )
      .example(
        "$0 simulate --speed 30",
        "Starts simulation with speed factor of 30, ie 1 Minute sim time = 1 Second real-time"
      );
  }
};

export default simulate;
