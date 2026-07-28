
import type { forgenvError, EnvSchema } from "../helper/types.js";
import { std } from "../stdout/Error.js";
import { normalize } from "../helper/helper.js";

export function validateEnv(
  env: Record<string, any>,
  schema: EnvSchema,
): Record<string, any> | forgenvError {
  const result: Record<string, any> = {};

  for (const key in schema) {
    const field = schema[key]!;
    const rawValue = env[key];
    const isSensitive = field.sensitive || field.sensetive;
    const value = rawValue;
    const errorReceived = isSensitive ? "[REDACTED]" : value;

    // ========================
    // MISSING VALUE HANDLING
    // ========================
    if (value === undefined || value === "") {
      if (field.default !== undefined) {
        if (
          process.env.NODE_ENV === "production" &&
          field.disallowDefaultInProduction
        ) {
          throw std.CreateError({
            Key: key,
            type: "UNSAFE_IN_PRODUCTION",
            message: `Default values for ${key} are disallowed in production`,
            received: errorReceived,
          });
        }
        result[key] = field.default;
      } else if (field.required) {
        throw std.CreateError({
          Key: key,
          type: "MISSING_KEY",
          message: `Missing required env var: ${key}`,
          received: errorReceived,
        });
      }

      if (!(key in result)) continue;
    } else {
      // ========================
      // ENUM VALIDATION
      // ========================
      if ("enum" in field) {
        const isCaseSensitive = field.caseSensitive ?? field.caseSensetive;
        const allowed = isCaseSensitive
          ? field.enum
          : field.enum.map((v) => String(v).toLowerCase());

        const actual = isCaseSensitive
          ? value
          : normalize(String(value).toLowerCase());

        if (!allowed.includes(actual)) {
          throw std.CreateError({
            Key: key,
            type: "INVALID_ENUM_VALUE",
            message: `Invalid value for ${key} expected '${field.enum.join(
              " or ",
            )}' but got '${errorReceived}'`,
            expected: field.enum,
            received: errorReceived,
          });
        }

        result[key] = value;
      }

      // ========================
      // TYPE VALIDATION
      // ========================
      if ("type" in field && !(key in result)) {
        switch (field.type) {
          case "string": {
            if (typeof value !== "string") {
              throw std.CreateError({
                Key: key,
                type: "TYPE_MISMATCH",
                message: `Expected string for ${key}`,
                received: errorReceived,
              });
            }

            if (field.length && value.length !== field.length) {
              throw std.CreateError({
                Key: key,
                type: "VALUE_TOO_LONG",
                message: `Expected length ${field.length}`,
                received: errorReceived,
              });
            }

            if (field.minLength && value.length < field.minLength) {
              throw std.CreateError({
                Key: key,
                type: "VALUE_TOO_SHORT",
                message: `Too short for ${key}`,
                received: errorReceived,
              });
            }

            if (field.maxLength && value.length > field.maxLength) {
              throw std.CreateError({
                Key: key,
                type: "VALUE_TOO_LONG",
                message: `Too long for ${key}`,
                received: errorReceived,
              });
            }

            if (field.regex) {
              const rx =
                field.regex instanceof RegExp
                  ? field.regex
                  : new RegExp(field.regex);

              if (!rx.test(value)) {
                throw std.CreateError({
                  Key: key,
                  type: "INVALID_REGEX_MATCH",
                  message: `Value for ${key} does not match regex pattern`,
                  received: errorReceived,
                });
              }
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
                received: errorReceived,
              });
            }

            if (field.min !== undefined && num < field.min) {
              throw std.CreateError({
                Key: key,
                type: "OUT_OF_RANGE",
                message: `Value ${num} for ${key} is below minimum ${field.min}`,
                received: errorReceived,
              });
            }

            if (field.max !== undefined && num > field.max) {
              throw std.CreateError({
                Key: key,
                type: "OUT_OF_RANGE",
                message: `Value ${num} for ${key} exceeds maximum ${field.max}`,
                received: errorReceived,
              });
            }

            result[key] = num;
            break;
          }

          case "url": {
            try {
              new URL(value);
            } catch {
              throw std.CreateError({
                Key: key,
                type: "INVALID_URL",
                message: `Invalid URL for ${key}`,
                received: errorReceived,
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
                    received: errorReceived,
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
                    received: errorReceived,
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
                    received: errorReceived,
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
                    received: errorReceived,
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
                    received: errorReceived,
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
                received: errorReceived,
              });
            }

            result[key] = value === "true";
            break;
          }
        }
      }
    }

    // ========================
    // TRANSFORM HOOK
    // ========================
    if (field.transform && key in result) {
      result[key] = field.transform(result[key]);
    }
  }

  return result;
}
