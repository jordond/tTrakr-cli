import chalk from "chalk";
import { CommandModule } from "yargs";

import { exit, TAG } from "./";
import { FILENAME, load } from "./config/config";
import Logger from "./utils/logger";
import { isEmpty } from "./utils/misc";

export type IYargsHandler = (args: any) => Promise<void | any>;

export function addMiddleware(command: CommandModule): CommandModule {
  return {
    ...command,
    handler: (args: ICommandOptions) =>
      before(command.handler as IYargsHandler, args)
  };
}

export async function before(handler: IYargsHandler, args: ICommandOptions) {
  Logger.verbose = Boolean(args.verbose);
  Logger.silent = Boolean(!Logger.verbose && args.silent);

  const log = new Logger(TAG);

  log.info(chalk`😊  Welcome to {magenta tTrakr}!`);
  if (args.verbose) {
    log.debug(
      chalk`i noticed you enabled {blue verbose} mode... prepare for {red all} the things!`
    );
  }

  const config = await loadConfig(args.configPath);

  // Call the handler, await its response catch any errors
  try {
    const result: any = await handler({ config, ...args });
    if (result) {
      log.info(result);
    }
    log.info(chalk`{blue so long!} hope you had {magenta fun} 😘`);
    return exit();
  } catch (error) {
    return exit(1, error);
  }
}

async function loadConfig(path?: string) {
  const log = new Logger(TAG);
  log.debug(chalk`looking for existing {cyan "${FILENAME}"} config file`);
  try {
    const config = await load(path);
    if (!isEmpty(config) && config.filepath) {
      log.info(chalk`{green ✔ using config} -> {blue ${config.filepath}}`);
    }
    return config;
  } catch (error) {
    log.error(chalk`something went {grey wrong} loading the config...`, error);
  }
  return {};
}
