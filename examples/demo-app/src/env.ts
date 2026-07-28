import { defineEnv } from "forgenv";

export const env = defineEnv([".env"], {
  NODE_ENV: {
    enum: ["development", "production", "test"],
    required: true,
  },

  PORT: {
    type: "number",
    min: 1024,
    max: 65535,
    default: 3000,
  },

  DATABASE_URL: {
    type: "format",
    format: "url",
    required: true,
  },

  API_FULL_URL: {
    type: "format",
    format: "url",
    required: true,
  },

  SECRET_KEY: {
    type: "string",
    minLength: 16,
    sensitive: true,
    required: true,
  },

  ALLOWED_ORIGINS: {
    type: "string",
    required: true,
    transform: (val: string) => val.split(",").map((s) => s.trim()),
  },
});
