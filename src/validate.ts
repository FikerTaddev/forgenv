import type { EnvSchema } from "./types.ts";
import { log } from "./helper/chalk.ts";
export function validateEnv(env: any, schema: EnvSchema) {
  for (const key in schema) {
    const rule = schema[key]; 
    const value = env[key];

    if (rule === undefined) {
      log.error("Unknown Key" , `Unknown env var: ${key}`)
      return 
    }
    if (rule.type == undefined) {
      log.error("Unknown Type" , `Unknown Type: ${key}`)
      return 
    }

    if (rule.required && value === undefined) { // Check if the variable is required 
      log.error("Missing Env Variable",`Missing required env var: ${key}`)
      return
    }

    if (rule.type === "number") { 
      if (isNaN(Number(value))) {
        log.error("Invalid Number Type",`Invalid number: ${key}`)
        return
      }
    }

    if (rule.type === "boolean") { 
      if (value !== "true" && value !== "false") {
        log.error("Invalid Boolean Type",`Invalid boolean: ${key}`)
        return
      }
    }
      log.success(`EnvGuard: ${key} successfully injected`)
  }

  return true;
}