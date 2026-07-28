import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateEnv } from "../core/validate.js";
import { expandVariables } from "../core/loader.js";
import type { EnvSchema } from "../helper/types.js";

describe("Production Features Test Suite", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe("Variable Expansion (${VAR})", () => {
    it("should substitute variables using parsed environment values", () => {
      const rawEnv = {
        HOST: "localhost",
        PORT: "5000",
        URL: "http://${HOST}:${PORT}/api",
      };
      const expanded = expandVariables(rawEnv);
      expect(expanded.URL).toBe("http://localhost:5000/api");
    });
  });

  describe("Sensitive Value Redaction", () => {
    it("should redact received values in error messages for sensitive fields", () => {
      const schema: EnvSchema = {
        DB_PASSWORD: { type: "string", minLength: 10, sensitive: true, required: true },
      };

      try {
        validateEnv({ DB_PASSWORD: "secret" }, schema);
        expect.unreachable("Should have thrown error");
      } catch (err: any) {
        expect(err.received).toBe("[REDACTED]");
      }
    });
  });

  describe("Production Mode Safety (disallowDefaultInProduction)", () => {
    it("should throw UNSAFE_IN_PRODUCTION when default fallback is used in production mode", () => {
      process.env.NODE_ENV = "production";
      const schema: EnvSchema = {
        API_KEY: {
          type: "string",
          default: "dev-key",
          disallowDefaultInProduction: true,
        },
      };

      expect(() => validateEnv({}, schema)).toThrow("Default values for API_KEY are disallowed in production");
    });

    it("should allow default fallback when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      const schema: EnvSchema = {
        API_KEY: {
          type: "string",
          default: "dev-key",
          disallowDefaultInProduction: true,
        },
      };

      expect(validateEnv({}, schema)).toEqual({ API_KEY: "dev-key" });
    });
  });

  describe("Numeric Range Constraints (min/max)", () => {
    it("should enforce minimum number bound", () => {
      const schema: EnvSchema = {
        PORT: { type: "number", min: 1024, max: 65535, required: true },
      };

      expect(() => validateEnv({ PORT: "80" }, schema)).toThrow("Value 80 for PORT is below minimum 1024");
      expect(() => validateEnv({ PORT: "70000" }, schema)).toThrow("Value 70000 for PORT exceeds maximum 65535");
      expect(validateEnv({ PORT: "8080" }, schema)).toEqual({ PORT: 8080 });
    });
  });

  describe("String Regex Pattern Matching", () => {
    it("should validate strings against regex pattern", () => {
      const schema: EnvSchema = {
        SEMVER: { type: "string", regex: /^\d+\.\d+\.\d+$/, required: true },
      };

      expect(() => validateEnv({ SEMVER: "v1.0" }, schema)).toThrow("Value for SEMVER does not match regex pattern");
      expect(validateEnv({ SEMVER: "1.0.0" }, schema)).toEqual({ SEMVER: "1.0.0" });
    });
  });

  describe("Custom Transform Parser Hook", () => {
    it("should apply custom transform functions to validated values", () => {
      const schema: EnvSchema = {
        ALLOWED_ORIGINS: {
          type: "string",
          required: true,
          transform: (val: string) => val.split(",").map((s) => s.trim()),
        },
      };

      const result = validateEnv({ ALLOWED_ORIGINS: "http://localhost, https://example.com" }, schema) as Record<string, any>;
      expect(result.ALLOWED_ORIGINS).toEqual(["http://localhost", "https://example.com"]);
    });
  });
});
