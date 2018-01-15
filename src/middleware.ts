import c from "chalk";
import { resolve } from "path";
import { CommandModule } from "yargs";

import { TAG } from "./";
import { FILENAME, load } from "./config/config";
import Logger from "./utils/logger";
import { isEmpty } from "./utils/misc";
import { randomMessage } from "./utils/fun";

export type IYargsHandler = (args: any) => Promise<void | any>;

export function addMiddleware(command: CommandModule): CommandModule {
  return {
    ...command,
    handler: (args: ICommandOptions) =>
      middleware(command.handler as IYargsHandler, args)
  };
}

export async function middleware(
  handler: IYargsHandler,
  args: ICommandOptions
) {
  Logger.verbose = Boolean(args.verbose);
  Logger.silent = Boolean(!Logger.verbose && args.silent);

  const log = new Logger(TAG);

  log.info(c`😊  Welcome to {magenta tTrakr}!`);
  if (args.verbose) {
    log.debug(
      c`i noticed you enabled {blue verbose} mode... prepare for {red all} the things!`
    );
  }

  const config = await loadConfig(args.configPath);

  // Call the handler, await its response catch any errors
  try {
    const result: any = await handler({ config, ...args });
    if (result) {
      log.info(result);
    }
    log.info(c`{blue so long!} ${randomMessage()}`);
    return exit();
  } catch (error) {
    return exit(1, error);
  }
}

async function loadConfig(path?: string) {
  const log = new Logger(TAG);
  log.debug(c`looking for existing {cyan "${FILENAME}"} config file`);
  if (path) {
    log.debug(c`searching user supplied path -> {green ${resolve(path)}}`);
  }
  try {
    const config = await load(path);
    if (!isEmpty(config) && config.filepath) {
      log.info(c`{green ✔ using config} -> {blue ${config.filepath}}`);
    }
    return config;
  } catch (error) {
    log.error(c`something went {grey wrong} loading the config...`, error);
  }
  return {};
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
