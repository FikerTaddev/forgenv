import { loadEnv } from "./core/loader.js";
import type { InferSchema } from "./helper/types.ts";
import { validateWithCache } from "./helper/Cache/validateCache.js";
import { createEnv } from "./runtime/envProxy.js";

export function defineEnv<T extends Record<string, any>>(
  env: string[] = [".env"],
  userSchema: T,
): InferSchema<T> {
  const rawEnv = loadEnv(env);
  const validated = validateWithCache(rawEnv, userSchema);
  return createEnv(validated) as InferSchema<T>;
}
