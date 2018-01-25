import c from "chalk";

import { verifyConfig } from "../../index";
import { exit } from "../../middleware";
import { ISimGame } from "../../simulation/game";
import { Simulation } from "../../simulation/simulation";
import { simMinuteToRealMillis } from "../../simulation/time";
import Logger from "../../utils/logger";
import { flatten } from "../../utils/misc";
import { prompt } from "../../utils/prompt";

const TAG = c`{yellow Sim}`;

export default async function({
  config = {},
  factor = 0,
  chance,
  maxGames,
  startRange,
  ...argv
}: ICommandOptions) {
  const log = new Logger(TAG);

  verifyConfig(config);

  if (factor !== 0) {
    log.debug(c`using {bold speed} factor {cyan ${factor as any}}`);
  }
  log.info(
    c`1 {green sim-Time} minute is equal to {blue ${(simMinuteToRealMillis(
      factor
    ) / 1000) as any}} {green real-time} seconds`
  );

  // Init simulation
  const settings = { factor, chance, maxGames, startRange };
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
  simulation.start(async () => {
    log.info("Simulation ended");
    log.info(c`auto-{cyan restarting} the simulation!`);
    await simulation.restart();
    displayCreatedGames(simulation.games);
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
    games.forEach(({ home, away }) =>
      log.debug(c`[{cyan ${home.name}}] VS [{magenta ${away.name}}]`)
    );
  }
}
