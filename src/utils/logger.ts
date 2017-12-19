import chalk from "chalk";

import { prettyObj, timestamp } from "./misc";

// tslint:disable:function-name

const { yellow, red, bgRed, blue, grey } = chalk;

export default class Logger {
  public tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  public i(msg: string, data?: any): Logger {
    return this.info(msg, data);
  }

  public info(msg: string, data?: any): Logger {
    return this.out(blue("INFO"), msg, data);
  }

  public debug(msg: string, data?: any): Logger {
    return this.out(grey("DEBUG"), grey(msg), grey(data));
  }

  public w(msg: string, data?: any): Logger {
    return this.warning(msg, data);
  }

  public warning(msg: string, data?: any): Logger {
    return this.out(yellow("WARN"), yellow(msg), yellow(data));
  }

  public e(msg: string, data?: any): Logger {
    return this.error(msg, data);
  }

  public error(msg: string, data?: any): Logger {
    return this.out(bgRed("ERROR"), red(msg), red(data));
  }

  private out(level: string, msg: string, data?: any): Logger {
    console.log(
      `[${timestamp()}][${level}][${this.tag}] ${msg}${
        data ? "\n" + prettyObj(data) : ""
      }`
    );
    return this;
  }
}
