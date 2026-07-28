import fs from "fs";
import path from "path";
import { defineEnv } from "../../index.js";
import { loadSchema, dotEnv } from "../../core/loader.js";
import { inferSchemaFromEnv } from "../../core/inferSchema.js";
import type { EnvSchema } from "../../helper/types.js";

export async function runCheck(flags: Record<string, string>) {
  const envFile = flags["env"] || ".env";
  const resolvedEnvPath = path.isAbsolute(envFile)
    ? envFile
    : path.resolve(process.cwd(), envFile);

  const envExists = fs.existsSync(resolvedEnvPath);
  const examplePath = path.resolve(process.cwd(), ".env.example");
  const exampleExists = fs.existsSync(examplePath);

  if (!envExists) {
    if (exampleExists) {
      throw new Error(
        `Environment file '${envFile}' does not exist.\n(Found '.env.example' - copy it to '${envFile}' to configure your variables).`,
      );
    }
    throw new Error(`Environment file '${envFile}' does not exist.`);
  }

  let schema: EnvSchema | undefined = undefined;

  if (flags["schema"]) {
    schema = await loadSchema(flags["schema"]);
  } else {
    const candidateSchemas = [
      "config/env.schema.ts",
      "env.schema.ts",
      "config/env.schema.js",
      "env.schema.js",
    ];

    for (const cand of candidateSchemas) {
      const resolvedCand = path.resolve(process.cwd(), cand);
      if (fs.existsSync(resolvedCand)) {
        try {
          schema = await loadSchema(cand);
          break;
        } catch {
          // ignore
        }
      }
    }
  }

  if (!schema) {
    let exampleEnv: Record<string, any> | undefined = undefined;
    if (exampleExists) {
      exampleEnv = dotEnv(examplePath);
    }

    const rawEnv = dotEnv(resolvedEnvPath);

    schema = inferSchemaFromEnv(rawEnv, exampleEnv);
  }

  const result = defineEnv([envFile], schema);

  console.log(`\n✔ Environment validation successful for [${envFile}]`);
  for (const [k, v] of Object.entries(result)) {
    const displayVal =
      typeof v === "string" && k.toLowerCase().includes("secret")
        ? "[REDACTED]"
        : v;
    console.log(`  • ${k}: ${displayVal}`);
  }

  return result;
}
