import fs from "fs";

import { getCacheFilePath } from "./fileResolver.js";

export function readCache(key: string) {
  const file = getCacheFilePath(key);
  if (!fs.existsSync(file)) return null;

  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}
