// tslint:disable
(function() {
  let argsToPass = [];
  try {
    const tryArgs = require("../cliargs.js");
    if (!tryArgs || !Array.isArray(tryArgs)) {
      throw new Error("Invalid args file");
    }
    argsToPass = tryArgs;
  } catch (error) {
    console.error(
      "Invalid args file, create a 'cliargs.js' in the root folder, and export an array of arguments"
    );
  }

  if (argsToPass.length) {
    console.log(`Debugging using arguments: ${argsToPass.join(" ")}`);
    process.argv.push.apply(process.argv, argsToPass);
  } else {
    console.error("No arguments passed in");
  }

  console.log("");
  require("../src").start();
})();
