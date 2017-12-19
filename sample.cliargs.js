/**
 * This is a sample file for arguments that can be passed to the CLI for debugging.
 * Duplicate this file, and change the arguments below.
 *
 * When debugging the CLI tool with VSCode, select the "CLI" launch option.
 * Then add your list of arguments here. They will be injected into argv before
 * the CLI tool runs.
 */
// prettier-ignore
module.exports = [
  "compile",
  "-s", "tsfl/examples",
  "-o", "tmp/",
  "-u"
]
