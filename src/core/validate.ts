
import type { EnvGuardError ,EnvSchema} from "../helper/types.js";
import { std } from "../stdout/Error.js";
import { normalize } from "../helper/helper.js";
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

      const actual = field.caseSensetive ? value : normalize(value.toLowerCase());
      if (!allowed.includes(actual)) {
        throw std.CreateError({
          Key: key,
          type: "INVALID_ENUM_VALUE",
          message: `Invalid value for ${key}  expected '${field.enum.join(" or ")}' but got '${value}' `,
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
        case "format": {
          const str = String(value);

          switch (field.format) {
            case "email": {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(str)) {
                throw std.CreateError({
                  Key: key,
                  type: "INVALID_EMAIL",
                  message: `Invalid email format for ${key}`,
                  received: value,
                });
              }
              break;
            }

            case "uuid": {
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

              if (!uuidRegex.test(str)) {
                throw std.CreateError({
                  Key: key,
                  type: "INVALID_FORMAT",
                  message: `Invalid UUID for ${key}`,
                  received: value,
                });
              }
              break;
            }

            case "slug": {
              const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

              if (!slugRegex.test(str)) {
                throw std.CreateError({
                  Key: key,
                  type: "INVALID_FORMAT",
                  message: `Invalid slug for ${key}`,
                  received: value,
                });
              }
              break;
            }

            case "ip": {
              const ipRegex =
                /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

              if (!ipRegex.test(str)) {
                throw std.CreateError({
                  Key: key,
                  type: "INVALID_FORMAT",
                  message: `Invalid IP address for ${key}`,
                  received: value,
                });
              }
              break;
            }

            case "url": {
              try {
                new URL(str);
              } catch {
                throw std.CreateError({
                  Key: key,
                  type: "INVALID_URL",
                  message: `Invalid URL for ${key}`,
                  received: value,
                });
              }
              break;
            }
          }

          result[key] = str;
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
