import fs from "fs";
import path from "path";
import { existsSync, readFileSync } from "fs";

export function dotEnv(filePath: string) {
  const env: Record<string, string> = {};

  if (!existsSync(filePath)) throw new Error(`path ${filePath} doesnt exist`);

  const file = readFileSync(filePath, "utf-8");

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

export function expandVariables(env: Record<string, any>): Record<string, any> {
  const expanded: Record<string, any> = { ...env };
  const varRegex = /\$\{([A-Za-z0-9_]+)\}/g;

  for (const key in expanded) {
    if (typeof expanded[key] === "string") {
      expanded[key] = expanded[key].replace(varRegex, (_: string, varName: string) => {
        return expanded[varName] ?? process.env[varName] ?? "";
      });
    }
  }

  return expanded;
}

export function loadEnv(files: string[] = [".env"]) {
  const fileList = Array.isArray(files) ? files : [files];
  const merged: Record<string, any> = {};

  for (const file of fileList) {
    const resolved = path.isAbsolute(file)
      ? file
      : path.resolve(process.cwd(), file);

    if (!fs.existsSync(resolved)) {
      throw new Error(`path ${resolved} doesnt exist`);
    }

    const result = dotEnv(resolved);
    Object.assign(merged, result);
  }

  return expandVariables(merged);
}

export async function loadSchema(schemaPath: string) {
  const resolved = path.isAbsolute(schemaPath)
    ? schemaPath
    : path.resolve(process.cwd(), schemaPath);

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