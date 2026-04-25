import { defineEnv } from "../../index.js"
import { loadSchema } from "../../core/loader.js";
export async function runCheck(flags: Record<string, string>) {
  if (!flags["env"]) throw new Error("Missing --env flag");
  if (!flags["schema"]) throw new Error("Missing --schema flag");


  const schema = await loadSchema(flags["schema"]);
  const env = flags["env"]
  return defineEnv([env], schema);
}

