import path from "node:path";
import fs from "fs";

export async function RunInit() {
  const ENV_EXAMPLE_DATA = `
   #forgenv
   PORT=3000
   DEBUG=FALSE
  `;
  const ENV_EXPORT_DATA = `
 //forgenv
 import {defineEnv ,loadSchema } from 'forgeenv'
 const schema = loadSchema('./env.schema.ts');
 const env = defineEnv(['.env'],schema);
 export default env;
  `;

  const ENV_SCHEMA_DATA = `
 const schema = {
   PORT: {
    type:'number',
    required:'true'
   },
   DEBUG: {
     type:'boolean',
     default:'false'
   }
 };

 export default schema
`;
  const ROOT_DIR = process.cwd();
  const CONFIG_DIR = path.join(ROOT_DIR, "config");
  const SCHEMA_PATH = path.join(CONFIG_DIR, "env.schema.ts");
  const ENV_EXPORT = path.join(CONFIG_DIR, "env.ts");
  const ENV_EXAMPLE = path.join(ROOT_DIR, ".env.example");
  let created = false;
  // Make sure Dirs exist
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR);
  }

  // check if .env.example exists

  if (!fs.existsSync(ENV_EXAMPLE)) {
    fs.writeFileSync(ENV_EXAMPLE, ENV_EXAMPLE_DATA);
    console.log(`created : ${ENV_EXAMPLE}`);
    created = true;
  }

  // check if env.ts exists
  console.log(ENV_EXPORT);
  if (!fs.existsSync(ENV_EXPORT)) {
    fs.writeFileSync(ENV_EXPORT, ENV_EXPORT_DATA);
    console.log(`created : ${ENV_EXPORT}`);
    created = true;
  }

  // check if schema file exists

  if (!fs.existsSync(SCHEMA_PATH)) {
    fs.writeFileSync(SCHEMA_PATH, ENV_SCHEMA_DATA);
    console.log(`created : ${SCHEMA_PATH}`);
    created = true;
  }

  if (!created) {
    console.log(`forgenvALready Initailized!`);
  }
}
