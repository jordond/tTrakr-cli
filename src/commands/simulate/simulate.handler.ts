import c from "chalk";

import { verifyConfig } from "../../index";
import { exit } from "../../middleware";
import { ISimGame, sortByDate } from "../../simulation/game";
import { Simulation } from "../../simulation/simulation";
import { simMinuteToRealMillis } from "../../simulation/time";
import Logger from "../../utils/logger";
import { flatten } from "../../utils/misc";
import { prompt } from "../../utils/prompt";

const TAG = c`{yellow Sim}`;

export default async function({
  config = {},
  factor = 1,
  chance,
  maxGames,
  startRange,
  restart = true,
  ...argv
}: ICommandOptions) {
  const log = new Logger(TAG);

  verifyConfig(config);

  const useFactor = factor < 1 ? 1 : factor;
  log.debug(c`using {bold speed} factor {cyan ${useFactor as any}}`);
  log.info(
    c`1 {green sim-Time} minute is equal to {blue ${(
      simMinuteToRealMillis(useFactor) / 1000
    ).toFixed(2)}} {green real-time} seconds`
  );

  if (useFactor > 30) {
    log.warning("a factor of 30 or higher is not recommended");
    log.warning("the game may be sped up too much");
  }

  // Init simulation
  const settings = { chance, maxGames, startRange, factor: useFactor };
  const simulation = await Simulation.build(settings);
  const players = flatten(simulation.teams.map(x => x.players)).length;

  // Display the player/team stats
  log
    .debug(c`using {cyan settings}`, simulation.settings)
    .info(c`found {blue ${simulation.teams.length as any}} teams`)
    .info(c`found {cyan ${players as any}} players`);

  // Display the game info
  displayCreatedGames(simulation.games);

  log.info(c`{green starting} the {cyan simulation}`);
  try {
    simulation.start(async () => {
      log.info("Simulation ended");
      if (restart) {
        log.info(c`auto-{cyan restarting} the simulation!`);

        await simulation.restart();
        displayCreatedGames(simulation.games);
      } else {
        log.info(c`{red auto-restart} is disabled, stopping all the fun!`);
        await simulation.stop();
        return exit();
      }
    });

    // TODO change this, it needs to just check for keypress
    log.info(c`press {bold {blue s}} to {red stop}`);
    await prompt({
      name: "command",
      message: "enter command:",
      type: "input",
      validate: input => input.toLowerCase() === "s"
    });

    log.info(c`stopping the {cyan simulation}!`);
    await simulation.stop();
  } catch (error) {
    log.error("Simulation threw an error!");
    throw error;
  }

  exit();

  // Check if game needs to start
  // start game

  // All games are finished
  // DEFAULT -> restart simulation, with different games
  // Stop completely

  // Set listeners for the database events
  // simulation started
  // game started
  // new period
  // new goal
  // new penalty
  // game finished
  // all games finished
}

function displayCreatedGames(games: ISimGame[]) {
  const log = new Logger(TAG);
  log.info(c`created {green ${games.length as any}} games`);
  if (Logger.verbose) {
    log.debug(c`List of games: [{cyan Home}] - [{magenta Away}]`);
    games
      .sort(sortByDate)
      .forEach(({ home, away, startTime }) =>
        log.debug(
          c`[{bold {green ${startTime.toLocaleTimeString()}}}][{cyan ${
            home.abbreviation
          }: ${home.name}}] VS [{magenta ${away.abbreviation}: ${away.name}}]`
        )
      );
  }
}
