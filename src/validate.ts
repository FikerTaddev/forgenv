import type { EnvSchema } from "./types.ts";
import type { EnvGuardError } from "./types.ts";
import { std } from "./stdout/Error.ts";
export function validateEnv(
  env: Record<string, any>,
  schema: EnvSchema,
): Record<string, any> | EnvGuardError {
  const result: Record<string, any> = {};

  for (const key in schema) {
    const field = schema[key]!;
    const value = env[key];

    // ========================
    // MISSING VALUE HANDLING
    // ========================
    if (value === undefined || value === "") {
      if (field.default !== undefined) {
        result[key] = field.default;
        continue;
      }

      if (field.required) {
        throw std.CreateError({
          Key: key,
          type: "MISSING_KEY",
          message: `Missing required env var: ${key}`,
          received: value,
        });
      }

      continue;
    }

    // ========================
    // ENUM VALIDATION
    // ========================
    if ("enum" in field) {
      const allowed = field.caseSensetive
        ? field.enum
        : field.enum.map((v) => String(v).toLowerCase());

      const actual = field.caseSensetive ? value : String(value).toLowerCase();

      if (!allowed.includes(actual)) {
        throw std.CreateError({
          Key: key,
          type: "INVALID_ENUM_VALUE",
          message: `Invalid value for ${key}  expected ${field.enum.join(", ")} but got ${value} `,
          expected: field.enum,
          received: value,
        });
      }

      result[key] = value;
      continue;
    }

    // ========================
    // TYPE VALIDATION
    // ========================
    if ("type" in field) {
      switch (field.type) {
        case "string": {
          if (typeof value !== "string") {
            throw std.CreateError({
              Key: key,
              type: "TYPE_MISMATCH",
              message: `Expected string for ${key}`,
              received: value,
            });
          }

          if (field.length && value.length !== field.length) {
            throw std.CreateError({
              Key: key,
              type: "VALUE_TOO_LONG",
              message: `Expected length ${field.length}`,
              received: value,
            });
          }

          if (field.minLength && value.length < field.minLength) {
            throw std.CreateError({
              Key: key,
              type: "VALUE_TOO_SHORT",
              message: `Too short for ${key}`,
              received: value,
            });
          }

          if (field.maxLength && value.length > field.maxLength) {
            throw std.CreateError({
              Key: key,
              type: "VALUE_TOO_LONG",
              message: `Too long for ${key}`,
              received: value,
            });
          }

          result[key] = value;
          break;
        }

        case "number": {
          const num = Number(value);

          if (Number.isNaN(num)) {
            throw std.CreateError({
              Key: key,
              type: "INVALID_NUMBER",
              message: `Invalid number for ${key}`,
              received: value,
            });
          }

          result[key] = num;
          break;
        }
        // -------------------------
        // URL
        // ---------------
        // ----------
        case "url": {
          try {
            new URL(value);
          } catch {
            throw std.CreateError({
              Key: key,
              type: "INVALID_URL",
              message: `Invalid URL for ${key}. Expected valid URL like ${field.protocols}://${field.hostname} but got ${value}`,
              received: value,
            });
          }

          result[key] = value;
          break;
        }

        case "boolean": {
          if (value !== "true" && value !== "false") {
            throw std.CreateError({
              Key: key,
              type: "INVALID_BOOLEAN",
              message: `Invalid boolean for ${key}`,
              received: value,
            });
          }

          result[key] = value === "true";
          break;
        }
      }
    }
  }

  return result;
}
