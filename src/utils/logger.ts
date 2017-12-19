import chalk from "chalk";

import { prettyObj, timestamp } from "./misc";

// tslint:disable:function-name

const { yellow, red, bgRed, blue, grey } = chalk;

const LEVEL_ERROR = "ERROR";
const LEVEL_WARN = "WARN";
const LEVEL_INFO = "INFO";
const LEVEL_DEBUG = "DEBUG";

export default class Logger {
  public tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  public i(msg: string, data?: any): Logger {
    return this.info(msg, data);
  }

  public info(msg: string, data?: any): Logger {
    return this.out(blue(LEVEL_INFO), msg, data);
  }

  public debug(msg: string, data?: any): Logger {
    return this.out(grey(LEVEL_DEBUG), grey(msg), data);
  }

  public w(msg: string, data?: any): Logger {
    return this.warning(msg, data);
  }

  public warning(msg: string, data?: any): Logger {
    return this.out(yellow(LEVEL_WARN), yellow(msg), data);
  }

  public e(msg: string, data?: any): Logger {
    return this.error(msg, data);
  }

  public error(msg: string, data?: any): Logger {
    return this.out(bgRed(LEVEL_ERROR), red(msg), data);
  }

  private out(level: string, msg: string, data?: any): Logger {
    console.log(
      `[${timestamp()}][${level}][${this.tag}] ${msg}${
        data ? "\n" + (data instanceof Error ? data : prettyObj(data)) : ""
      }`
    );
    return this;
  }
}
