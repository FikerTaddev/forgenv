import type { EnvSchema } from "../helper/types.js";

export function inferSchemaFromEnv(
  rawEnv: Record<string, any>,
  exampleEnv?: Record<string, any>,
): EnvSchema {
  const schema: EnvSchema = {};
  const allKeys = new Set([
    ...Object.keys(rawEnv),
    ...Object.keys(exampleEnv || {}),
  ]);

  for (const key of allKeys) {
    const val = rawEnv[key] ?? exampleEnv?.[key] ?? "";
    const strVal = String(val).trim();
    // Key is required if it exists in .env.example or if no example exists
    const isRequired = exampleEnv ? key in exampleEnv : true;

    if (strVal === "true" || strVal === "false") {
      schema[key] = { type: "boolean", required: isRequired };
    } else if (!Number.isNaN(Number(strVal)) && strVal !== "") {
      schema[key] = { type: "number", required: isRequired };
    } else if (strVal.startsWith("http://") || strVal.startsWith("https://")) {
      schema[key] = { type: "url", required: isRequired };
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      schema[key] = { type: "format", format: "email", required: isRequired };
    } else {
      schema[key] = { type: "string", required: isRequired };
    }
  }

  return schema;
}
