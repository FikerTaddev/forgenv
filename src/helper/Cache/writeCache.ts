import fs from "fs";
import { getCacheFilePath } from "./fileResolver.js";

export function writeCache(key: string, data: any) {
  const file = getCacheFilePath(key);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}
