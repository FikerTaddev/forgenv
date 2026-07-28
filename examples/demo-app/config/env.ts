import { defineEnv } from "forgenv";
import schema from "./env.schema.js";

const env = defineEnv([".env"], schema);
export default env;