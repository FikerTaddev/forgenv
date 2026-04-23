import { loadEnv } from "./src/core/loader.js";
import type { InferSchema } from "./src/core/types.ts";
import { validateWithCache } from "./src/helper/Cache/validateCache.js";
import { createEnv } from "./src/runtime/envProxy.js";

export function defineEnv<T extends Record<string, any>>(
  env: string[],
  userSchema: T,
): InferSchema<T> {
  const rawEnv = loadEnv(env);
  const validated = validateWithCache(rawEnv, userSchema);
  return createEnv(validated) as InferSchema<T>;
}
