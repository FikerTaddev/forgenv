#!usr/bin/env node

import { defineEnv } from "../../index.js";
import schema from "../schema.js"


const args = process.argv.slice(2);
const command = args[0];

function runCheck() {
  try {
    defineEnv([".env"],schema);
    console.log("✅ EnvGuard: environment is valid");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ EnvGuard error:");
    console.error(err);
    process.exit(1);
  }
}

function runInit() {
  console.log("📦 EnvGuard init not implemented yet");
}

switch (command) {
  case "check":
    runCheck();
    break;

  case "init":
    runInit();
    break;

  default:
    console.log(`
EnvGuard CLI

Commands:
  check   Validate environment
  init    Scaffold env setup
`);
    process.exit(1);
}
