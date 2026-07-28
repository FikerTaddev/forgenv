
 //forgenv
 import {defineEnv ,loadSchema } from 'forgeenv'
 const schema = loadSchema('./env.schema.ts');
 const env = defineEnv(['.env'],schema);
 export default env;
  