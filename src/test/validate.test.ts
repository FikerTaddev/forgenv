import { validateEnv } from "../validate.ts";
import type { EnvSchema } from "../types.ts";
import { describe, it, expect  } from "vitest";

describe("validateEnv", () => {
  it("should throw an error if a required env var is missing", () => {
    const schema: EnvSchema = {
      REQUIRED_VAR: { type: "string", required: true },
    };

    const env = {};

    expect(() => validateEnv(env, schema)).toThrow(
      "Missing required env var: REQUIRED_VAR"
    );
  });

  it("should not throw an error if a non-required env var is missing", () => {
    const schema: EnvSchema = {
      OPTIONAL_VAR: { type: "string", required: false },
    };

    const env = {};

    expect(() => validateEnv(env, schema)).not.toThrow();
  });

  it("should throw an error for an invalid number", () => {
    const schema: EnvSchema = {
      NUMBER_VAR: { type: "number", required: true },
    };

    const env = { NUMBER_VAR: "not-a-number" };

    expect(() => validateEnv(env, schema)).toThrow(
      "Invalid number: NUMBER_VAR"
    );
  });

  it("should throw an error for an invalid boolean", () => {
    const schema: EnvSchema = {
      BOOLEAN_VAR: { type: "boolean", required: true },
    };

    const env = { BOOLEAN_VAR: "not-a-boolean" };

    expect(() => validateEnv(env, schema)).toThrow(
      "Invalid boolean: BOOLEAN_VAR"
    );
  });

  it("should pass for valid env vars", () => {
    const schema: EnvSchema = {
      STRING_VAR: { type: "string", required: true },
      NUMBER_VAR: { type: "number", required: true },
      BOOLEAN_VAR: { type: "boolean", required: true },
    };

    const env = {
      STRING_VAR: "some string",
      NUMBER_VAR: "123",
      BOOLEAN_VAR: "true",
    };

    expect(() => validateEnv(env, schema)).not.toThrow();
  });
});