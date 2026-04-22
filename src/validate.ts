import type { EnvSchema } from "./types.ts";
import { log } from "./helper/chalk.ts";
import type { EnvGuardError } from "./types.ts";
import { std } from "./stdout/Error.ts";

export function validateEnv(
  env: Record<string, any>,
  schema: EnvSchema,
): EnvGuardError | boolean {
  const envKeys = Object.keys(env);
  const schemaKeys = Object.keys(schema);

  // 1. Detect unknown env vars (STRICT MODE)
  for (const key of envKeys) {
    if (!schema[key]) {
      throw std.CreateError({
        Key: key,
        type: "INVALID_FORMAT",
        message: `Unexpected env var: ${key}`,
        received: env[key],
      });
    }
  }

  // 2. Validate schema rules
  for (const key of schemaKeys) {
    const rule = schema[key];
    const value = env[key];

    if (!rule?.type) {
      throw std.CreateError({
        Key: key,
        type: "INVALID_SCHEMA",
        message: `Missing type for: ${key}`,
        received: env[key],
      });
    }

    // required check
    if (rule.required && (value === undefined || value === "")) {
      throw std.CreateError({
        Key: key,
        type: "MISSING_KEY",
        message: `Missing required env var: ${key}`,
        received: env[key],
      });
    }

    // length check
    if (rule.length) {
      let len = value.length;
      if (len != rule.length) {
        throw std.CreateError({
          Key: key,
          type: "INVALID_SCHEMA",
          message: `Length for ${key} is supposed to be ${rule.length} but got ${value.length}`,
          received: env[key],
        });
      }
    }

    // skip validation if optional and missing
    if (value === undefined) continue;

    // STRING
    if (rule.type === "string") {
      if (typeof value !== "string") {
        log.error("Invalid String Type", `Invalid string: ${key}`);
        throw std.CreateError({
          Key: key,
          type: "TYPE_MISMATCH",
          message: `Invalid string: ${key}`,
          received: env[key],
        });
      }
    }

    // NUMBER
    if (rule.type === "number") {
      if (isNaN(Number(value))) {
        throw std.CreateError({
          Key: key,
          type: "TYPE_MISMATCH",
          message: `Invalid number: ${key}`,
          received: env[key],
        });
      }
    }

    // BOOLEAN
    if (rule.type === "boolean") {
      if (value !== "true" && value !== "false") {
        throw std.CreateError({
          Key: key,
          type: "TYPE_MISMATCH",
          message: `Invalid boolean: ${key}`,
          received: env[key],
        });
      }
    }
  }

  return true;
}
