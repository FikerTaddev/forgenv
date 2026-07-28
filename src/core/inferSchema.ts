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

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const key of allKeys) {
    const val = rawEnv[key] ?? exampleEnv?.[key] ?? "";
    const strVal = String(val).trim();
    const isRequired = exampleEnv ? key in exampleEnv : true;

    if (strVal === "true" || strVal === "false") {
      schema[key] = { type: "boolean", required: isRequired };
    } else if (!Number.isNaN(Number(strVal)) && strVal !== "") {
      schema[key] = { type: "number", required: isRequired };
    } else if (uuidRegex.test(strVal)) {
      schema[key] = { type: "format", format: "uuid", required: isRequired };
    } else if (ipRegex.test(strVal)) {
      schema[key] = { type: "format", format: "ip", required: isRequired };
    } else if (emailRegex.test(strVal)) {
      schema[key] = { type: "format", format: "email", required: isRequired };
    } else if (strVal.startsWith("http://") || strVal.startsWith("https://")) {
      schema[key] = { type: "url", required: isRequired };
    } else if (key.toUpperCase().includes("SLUG") && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(strVal)) {
      schema[key] = { type: "format", format: "slug", required: isRequired };
    } else {
      schema[key] = { type: "string", required: isRequired };
    }
  }

  return schema;
}
