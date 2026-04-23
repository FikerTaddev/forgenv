import { loadEnv } from "./src/core/loader.js";
import { validateWithCache } from "./src/helper/Cache/validateCache.js";
import { createEnv } from "./src/runtime/envProxy.js";

export function defineEnv<T extends Record<string, any>>(
  env: string[],
  userSchema: T,
) {
  const rawEnv = loadEnv(env);
  const validated = validateWithCache(rawEnv, userSchema);
  return createEnv(validated);
}
