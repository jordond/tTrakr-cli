/**
 * @module commands
 * @description Central location for all the commands for the CLI
 */

import { CommandModule } from "yargs"; // tslint:disable-line

import generate from "./generate";

/**
 * @constant {CommandModule[]} - Array of yargs CommandModules
 */
export default [generate];
