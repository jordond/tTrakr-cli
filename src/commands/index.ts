/**
 * @module commands
 * @description Central location for all the commands for the CLI
 */

import { CommandModule } from "yargs"; // tslint:disable-line

import generate from "./generate";
import init from "./init";
import seed from "./seed";
import simulate from "./simulate";
import verify from "./verify";

/**
 * @constant {CommandModule[]} - Array of yargs CommandModules
 */
export default [init, generate, seed, simulate, verify];
