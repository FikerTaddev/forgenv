#!/usr/bin/env node

import { parseFlags } from "./parser.js";
import { runCheck } from "./cmd/check.js";
import { RunInit } from "./cmd/init.js";
import { runGenerate } from "./cmd/generate.js";
import { std } from "../stdout/Error.js";

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  try {
    if (!command || command === "check") {
      await runCheck(parseFlags(args));
    } else if (command === "init") {
      await RunInit();
    } else if (command === "generate") {
      runGenerate(parseFlags(args));
    } else {
      console.log(`
forgenv CLI

Usage:
  forgenv                 Auto-detect & validate environment (.env)
  forgenv check           Validate environment
  forgenv check --env .env --schema ./config/env.schema.ts
  forgenv init            Scaffold env setup
  forgenv generate        Generate TypeScript type definitions (env.d.ts)
`);
      process.exit(1);
    }

    process.exit(0);
  } catch (err: any) {
    console.error(std.LogError(err));
    process.exit(1);
  }
})();
