import chalk from "chalk";

import { prettyObj, timestamp } from "./misc";

// tslint:disable:function-name

const { yellow, red, grey } = chalk;

const LEVEL_ERROR = chalk`{bgRed ERROR}`;
const LEVEL_WARN = chalk`{bgYellow WARN }`;
const LEVEL_INFO = chalk`{blue INFO }`;
const LEVEL_DEBUG = chalk`{grey DEBUG}`;

export default class Logger {
  public static verbose: boolean = false;
  public static silent: boolean = false;

  public tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  public i(msg: string, data?: any): Logger {
    return this.info(msg, data);
  }

  public info(msg: string, data?: any): Logger {
    return this.out(LEVEL_INFO, msg, data);
  }

  public debug(msg: string, data?: any): Logger {
    return this.out(LEVEL_DEBUG, grey(msg), data);
  }

  public w(msg: string, data?: any): Logger {
    return this.warning(msg, data);
  }

  public warning(msg: string, data?: any): Logger {
    return this.out(LEVEL_WARN, yellow(msg), data);
  }

  public e(msg: string, data?: any): Logger {
    return this.error(msg, data);
  }

  public error(msg: string, data?: any): Logger {
    return this.out(LEVEL_ERROR, red(msg), data);
  }

  private out(level: string, msg: string, data?: any): Logger {
    if (this.canOutput(level)) {
      console.log(
        chalk`{grey [${timestamp()}]}[${level}][${this.tag}] ${msg}${
          data ? "\n" + (data instanceof Error ? data : prettyObj(data)) : ""
        }`
      );
    }
    return this;
  }

  private canOutput(level: string): boolean {
    if (Logger.silent) {
      return LEVEL_ERROR === level;
    }
    if (!Logger.verbose) {
      return LEVEL_DEBUG !== level;
    }
    return true;
  }
}
