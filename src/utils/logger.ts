import c from "chalk";

import { prettyObj, timestamp } from "./misc";

// tslint:disable:function-name

const { yellow, red, grey } = c;

export const LEVEL_ERROR = c`{bgRed ERROR}`;
export const LEVEL_WARN = c`{bgYellow WARN }`;
export const LEVEL_INFO = c`{blue INFO }`;
export const LEVEL_DEBUG = c`{grey DEBUG}`;

export const create = (tag?: string) => new Logger(tag);

export class Logger {
  public static verbose: boolean = false;
  public static silent: boolean = false;

  public tag: string;

  constructor(tag: string = "CLI") {
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

  public prefix(level: string = LEVEL_INFO): string {
    return c`{grey [${timestamp()}][${level}][${this.tag}]}`;
  }

  private out(level: string, msg: string, data?: any): Logger {
    if (this.canOutput(level)) {
      console.log(
        c`${this.prefix(level)} ${msg}${
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

export default Logger;
