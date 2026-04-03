import type { EnvSchema } from "./types.ts";
import { log } from "./helper/chalk.ts";

export function validateEnv(env: Record<string, any>, schema: EnvSchema) {
  const envKeys = Object.keys(env);
  const schemaKeys = Object.keys(schema);

  // 1. Detect unknown env vars (STRICT MODE)
  for (const key of envKeys) {
    if (!schema[key]) {
      log.error("Unknown Env Variable", `Unexpected env var: ${key}`);
      return false;
    } 
  }

  // 2. Validate schema rules
  for (const key of schemaKeys) {
    const rule = schema[key];
    const value = env[key];

    if (!rule?.type) {
      log.error("Invalid Schema", `Missing type for: ${key}`);
      return false;
    }

    // required check
    if (rule.required && (value === undefined || value === "")) {
      log.error("Missing Env Variable", `Missing required env var: ${key}`);
      return false;
    }

    // skip validation if optional and missing
    if (value === undefined) continue;

    // STRING
    if (rule.type === "string") {
      if (typeof value !== "string") {
        log.error("Invalid String Type", `Invalid string: ${key}`);
        return false;
      }
    }

    // NUMBER
    if (rule.type === "number") {
      if (isNaN(Number(value))) {
        log.error("Invalid Number Type", `Invalid number: ${key}`);
        return false;
      }
    }

    // BOOLEAN
    if (rule.type === "boolean") {
      if (value !== "true" && value !== "false") {
        log.error("Invalid Boolean Type", `Invalid boolean: ${key}`);
        return false;
      }
    }

    log.success(`EnvGuard: ${key} validated`);
  }

  return true;
}