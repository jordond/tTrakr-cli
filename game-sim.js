const argv = require("yargs").argv;
const { sampleSize, sample } = require("lodash");

const speedFactor = argv.speed || 1;
const numberOfGames = argv.games || 4;
const startRange = argv.start || 50;
const eventChance = argv.chance || 5;

const log = (msg, data = "") => console.log(msg, data);

const teams = [
  {
    abbrev: "ANA",
    name: "Anaheim Ducks",
    players: [
      {
        name: "Jason Doe"
      },
      {
        name: "Foo Bar"
      },
      {
        name: "Mike Hunt"
      },
      {
        name: "Jeff Danger"
      }
    ]
  },
  {
    abbrev: "BOS",
    name: "Boston Bruins",
    players: [
      {
        name: "Craig Denger"
      },
      {
        name: "Bengashi Mex"
      },
      {
        name: "Floop shoop"
      },
      {
        name: "Poop Voop"
      }
    ]
  },
  {
    abbrev: "JOR",
    name: "Jordon Beavers",
    players: [
      {
        name: "Jordon deHoog"
      },
      {
        name: "Lake Nut"
      },
      {
        name: "Beaver Munch"
      },
      {
        name: "Car Horse"
      }
    ]
  },
  {
    abbrev: "BOO",
    name: "Blue Footed Boobs",
    players: [
      {
        name: "Beep Doe"
      },
      {
        name: "Crazy Bar"
      },
      {
        name: "Mike Copperfield"
      },
      {
        name: "Crayola 444"
      }
    ]
  }
];

function init() {
  log(`Starting the game with speed factor: ${speedFactor}`);

  log(`Creating ${numberOfGames} games`);
  const games = [];
  for (let i = 0; i < numberOfGames; i++) {
    const random = sampleSize(teams, 2);
    games.push({
      home: random[0].abbrev,
      away: random[1].abbrev,
      start: Math.floor(Math.random() * startRange)
    });
  }

  log("Created the games");
  games.forEach((x, i) =>
    log(`Game ${i}: ${x.away} @ ${x.home} in ${x.start} mins`)
  );

  start(games);
}

let interval;
function start(games) {
  const oneMinute = Math.floor(
    60 * 1000 / (speedFactor >= 2 ? speedFactor * 2 : 1)
  );
  log(`One minute is equal to ${oneMinute / 1000}s`);

  interval = setInterval(_ => loop(games), oneMinute);
  log(`Start time: ${new Date().toLocaleTimeString()}`);
}

let count = 0;
let mins = 0;
let time = 0.0;

const sTime = _ => time.toFixed(2);
function loop(games) {
  let finishedCount = 0;
  time += 0.01;
  mins++;
  for (game of games) {
    if (game.finished) {
      finishedCount++;
      continue;
    }

    // Update the game
    if (game.active) {
      game.periodTime--;

      // Period is over, start new period
      if (game.periodTime === 0) {
        // Game is over
        if (game.period === 3) {
          log(`${game.away} @ ${game.home}: GAME IS OVER`);
          game.finished = true;
          log(
            `${game.away} @ ${game.home} finished: ${game.awayScore} - ${
              game.homeScore
            } @ TIME: ${sTime()}`
          );
          if (game.awayScore > game.homeScore) {
            log(`\t ${game.away} WINS!`);
          } else if (game.homeScore > game.awayScore) {
            log(`\t ${game.home} WINS!`);
          } else {
            log(`\t TIE!`);
          }
        } else {
          game.period++;
          game.periodTime = 20;
          log(
            `${game.away} @ ${game.home}: starting period ${
              game.period
            } @ TIME: ${sTime()}`
          );
        }
      }

      // Check if an event is happening
      const needsEvent = mins === game.start + game.nextEvent;
      if (needsEvent) {
        game.nextEvent = mins + Math.floor(Math.random() * eventChance) + 1;

        const event = Math.floor(Math.random() * 3);
        switch (event) {
          case 0: // Goal
          case 1:
            const scoringTeam =
              Math.floor(Math.random() * 2) === 0 ? "home" : "away";

            let team;
            if (scoringTeam === "home") {
              team = teams.find(x => x.abbrev === game.home);
              game.homeScore++;
            } else {
              team = teams.find(x => x.abbrev === game.away);
              game.awayScore++;
            }
            if (team) {
              const player = sample(team.players);
              const assists = sampleSize(
                team.players,
                Math.floor(Math.random() * 3)
              );
              log(
                `${game.away} @ ${game.home}: ${
                  player.name
                } scored a goal for ${team.abbrev} @ ${sTime()}`
              );
              if (assists.length) {
                log(`\t assist from ${assists.map(x => x.name)}`);
              }
            }
            break;
          case 2: // Penalty
            log(`${game.away} @ ${game.home}: TODO penalty`);
            break;
        }
      }
    }

    // Start the game
    if (!game.active && mins >= game.start) {
      log(`Starting game: ${game.away} @ ${game.home} @ TIME: ${sTime()}`);
      game.active = true;
      game.period = 1;
      game.periodTime = 20;
      game.homeScore = 0;
      game.awayScore = 0;
      game.nextEvent = Math.floor(Math.random() * eventChance) + 1;
      log(`NEXT EVENT: ${game.nextEvent}`);
    }
  }

  if (finishedCount === games.length) {
    log(`ALL GAMES FINISHED @ ${sTime()}`);
    clearInterval(interval);
  }
}

init();
