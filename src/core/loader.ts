import fs from "fs";
import path from "path";
import { existsSync, readFileSync } from "fs";

export function dotEnv(path: string) {
  const env: Record<string, string> = {};

  if (!existsSync(path)) return;

  const file = readFileSync(path, "utf-8");

  for (const line of file.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...rest] = trimmed.split("=");

    const value = rest.join("=");

    if (!key) continue;

    env[key.trim()] = value.trim();
  }

  return env;
}
export function loadEnv(files: string[] = [".env"]) {
  const fileList = Array.isArray(files) ? files : [files];

  const merged: Record<string, string> = {};

  for (const file of fileList) {
   

    if (!fs.existsSync(file)) continue;
   
    const result = dotEnv(file);

    Object.assign(merged, result);
  }

  return merged;
}

export async function loadSchema(schemaPath: string) {
  const resolved = path.resolve(process.cwd(), schemaPath);

  try {
    const mod = await import(resolved);
    const schema = mod.default ?? mod;

    if (!schema || typeof schema !== "object") {
      throw new Error("Invalid schema export");
    }

    return schema;
  } catch (err: any) {
    throw new Error(`Failed to load schema: ${err.message}`);
  }
}