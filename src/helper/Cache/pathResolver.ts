import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".forgenv", "caches", "env");

export function ensureCachedir() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  return CACHE_DIR;
}
