import { loadEnv } from "./core/loader.js";
import type { EnvSchema, InferSchema } from "./helper/types.js";
import { validateWithCache } from "./helper/Cache/validateCache.js";
import { createEnv } from "./runtime/envProxy.js";
import { inferSchemaFromEnv } from "./core/inferSchema.js";

export function defineEnv<T extends EnvSchema = EnvSchema>(
  env: string[] = [".env"],
  userSchema?: T,
): InferSchema<T> {
  const rawEnv = loadEnv(env);
  const schema = userSchema ?? (inferSchemaFromEnv(rawEnv) as T);

  const validated = validateWithCache(rawEnv, schema);

  return createEnv(validated) as InferSchema<T>;
}
