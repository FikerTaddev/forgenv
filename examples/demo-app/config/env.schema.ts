import type { EnvSchema } from "forgenv";

const schema: EnvSchema = {
  PORT: {
    type: "number",
    required: true,
  },
  DEBUG: {
    type: "boolean",
    default: false,
  },
};

export default schema;
