#!/usr/bin/env node

import { parseFlags } from "./parser.js";
import { runCheck } from "./cmd/check.js";
import { RunInit } from "./cmd/init.js";
import { std } from "../stdout/Error.js";


const args = process.argv.slice(2);
const command = args[0];
(async () => {
  try {
    switch (command) {
      case "check":
        await runCheck(parseFlags(args));
        break;

      case "init":
        await RunInit();
        break;

      default:
        console.log(`
forgenv CLI

Commands:
  check   Validate environment
  init    Scaffold env setup
`);
        process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    console.error(std.LogError(err));
    process.exit(1);
  }
})();
