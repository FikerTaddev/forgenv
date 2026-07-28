import { hashEnv } from "../helper.js";
import { writeCache } from "./writeCache.js";
import { readCache } from "./ReadCache.js";
import type { EnvSchema } from "../../helper/types.js";
import { validateEnv } from "../../core/validate.js";
export function validateWithCache(env: Record<string, any>, schema: EnvSchema) {
  const key = hashEnv(env, schema);
  const cached = readCache(key);
  if (cached) return cached;
  const result = validateEnv(env, schema);

  writeCache(key, result);
  return result;
}
