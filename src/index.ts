import { loadEnv } from "./loader.ts";
import { validateEnv } from "./validate.ts";
import { log } from "./helper/chalk.ts";


try {
  const env = loadEnv();

  validateEnv(env, {
    PORT: "number",
    DEBUG: "boolean",
  });

  log.success("Environment validated");
} catch (err: any) {
  log.error("Env validation failed", err.message);
  process.exit(1);
}