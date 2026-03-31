import type { EnvSchema } from "./types.ts";

export function validateEnv(env: any, schema: EnvSchema) {
  for (const key in schema) {
    const expectedType = schema[key];
    const value = env[key];

    if (value === undefined) {
      throw new Error(`Missing env var: ${key}`);
    }

    if (expectedType === "number") {
      if (isNaN(Number(value))) {
        throw new Error(`Invalid number: ${key}`);
      }
    }

    if (expectedType === "boolean") {
      if (value !== "true" && value !== "false") {
        throw new Error(`Invalid boolean: ${key}`);
      }
    }
  }

  return true;
}