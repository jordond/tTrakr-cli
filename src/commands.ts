/**
 * @module commands
 * @description Central location for all the commands for the CLI
 */

import { CommandModule } from "yargs"; // tslint:disable-line

import generate from "./commands/generate";
import init from "./commands/init";
import verify from "./commands/verify";

/**
 * @constant {CommandModule[]} - Array of yargs CommandModules
 */
export default [init, generate, verify];
