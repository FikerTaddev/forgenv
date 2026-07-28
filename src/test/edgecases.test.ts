import { describe, it, expect } from "vitest";
import { validateEnv } from "../core/validate.js";
import { createEnv } from "../runtime/envProxy.js";
import { validateWithCache } from "../helper/Cache/validateCache.js";
import { loadEnv } from "../core/loader.js";
import type { EnvSchema } from "../helper/types.js";

describe("Edge Case & Future Feature Validation Tests", () => {
  describe("String Length Validation Edge Cases", () => {
    it("should fail when string length is below minLength", () => {
      const schema: EnvSchema = {
        SECRET: { type: "string", minLength: 8, required: true },
      };
      expect(() => validateEnv({ SECRET: "short" }, schema)).toThrow("Too short for SECRET");
    });

    it("should fail when string length exceeds maxLength", () => {
      const schema: EnvSchema = {
        TAG: { type: "string", maxLength: 5, required: true },
      };
      expect(() => validateEnv({ TAG: "too-long-value" }, schema)).toThrow("Too long for TAG");
    });

    it("should enforce exact length constraint", () => {
      const schema: EnvSchema = {
        CODE: { type: "string", length: 4, required: true },
      };
      expect(() => validateEnv({ CODE: "123" }, schema)).toThrow("Expected length 4");
      expect(() => validateEnv({ CODE: "12345" }, schema)).toThrow("Expected length 4");
      expect(validateEnv({ CODE: "1234" }, schema)).toEqual({ CODE: "1234" });
    });
  });

  describe("Format Type Validations", () => {
    it("should validate email format correctly", () => {
      const schema: EnvSchema = {
        ADMIN_EMAIL: { type: "format", format: "email", required: true },
      };
      expect(() => validateEnv({ ADMIN_EMAIL: "invalid-email" }, schema)).toThrow("Invalid email format for ADMIN_EMAIL");
      expect(validateEnv({ ADMIN_EMAIL: "admin@example.com" }, schema)).toEqual({ ADMIN_EMAIL: "admin@example.com" });
    });

    it("should validate UUID format correctly", () => {
      const schema: EnvSchema = {
        APP_ID: { type: "format", format: "uuid", required: true },
      };
      expect(() => validateEnv({ APP_ID: "not-a-uuid" }, schema)).toThrow("Invalid UUID for APP_ID");
      expect(validateEnv({ APP_ID: "123e4567-e89b-12d3-a456-426614174000" }, schema)).toEqual({
        APP_ID: "123e4567-e89b-12d3-a456-426614174000",
      });
    });

    it("should validate Slug format correctly", () => {
      const schema: EnvSchema = {
        PROJECT_SLUG: { type: "format", format: "slug", required: true },
      };
      expect(() => validateEnv({ PROJECT_SLUG: "Invalid Slug!" }, schema)).toThrow("Invalid slug for PROJECT_SLUG");
      expect(validateEnv({ PROJECT_SLUG: "my-cool-project" }, schema)).toEqual({
        PROJECT_SLUG: "my-cool-project",
      });
    });

    it("should validate IP address format correctly", () => {
      const schema: EnvSchema = {
        BIND_IP: { type: "format", format: "ip", required: true },
      };
      expect(() => validateEnv({ BIND_IP: "999.999.999.999" }, schema)).toThrow("Invalid IP address for BIND_IP");
      expect(validateEnv({ BIND_IP: "127.0.0.1" }, schema)).toEqual({ BIND_IP: "127.0.0.1" });
    });

    it("should validate URL format correctly", () => {
      const schema: EnvSchema = {
        API_URL: { type: "format", format: "url", required: true },
      };
      expect(() => validateEnv({ API_URL: "not-a-valid-url" }, schema)).toThrow("Invalid URL for API_URL");
      expect(validateEnv({ API_URL: "https://api.example.com/v1" }, schema)).toEqual({
        API_URL: "https://api.example.com/v1",
      });
    });
  });

  describe("URL Type Validation", () => {
    it("should validate standalone URL field type", () => {
      const schema: EnvSchema = {
        ENDPOINT: { type: "url", required: true },
      };
      expect(() => validateEnv({ ENDPOINT: "invalid-url-string" }, schema)).toThrow("Invalid URL for ENDPOINT");
      expect(validateEnv({ ENDPOINT: "https://example.com" }, schema)).toEqual({
        ENDPOINT: "https://example.com",
      });
    });
  });

  describe("Enum Validation & Case Sensitivity Edge Cases", () => {
    it("should handle case-insensitive enum validation by default", () => {
      const schema: EnvSchema = {
        ENVIRONMENT: { enum: ["development", "production", "staging"], required: true },
      };
      expect(validateEnv({ ENVIRONMENT: "DEVELOPMENT" }, schema)).toEqual({ ENVIRONMENT: "DEVELOPMENT" });
      expect(validateEnv({ ENVIRONMENT: "Production" }, schema)).toEqual({ ENVIRONMENT: "Production" });
    });

    it("should strictly enforce case sensitivity when caseSensitive is true", () => {
      const schema: EnvSchema = {
        LOG_LEVEL: { enum: ["INFO", "DEBUG", "WARN"], caseSensitive: true, required: true },
      };
      expect(() => validateEnv({ LOG_LEVEL: "info" }, schema)).toThrow("Invalid value for LOG_LEVEL");
      expect(validateEnv({ LOG_LEVEL: "INFO" }, schema)).toEqual({ LOG_LEVEL: "INFO" });
    });
  });

  describe("Default Values & Optional Keys", () => {
    it("should fallback to default values when variable is undefined or empty string", () => {
      const schema: EnvSchema = {
        PORT: { type: "number", default: 8080 },
        DEBUG: { type: "boolean", default: false },
      };
      expect(validateEnv({ PORT: "" }, schema)).toEqual({ PORT: 8080, DEBUG: false });
      expect(validateEnv({}, schema)).toEqual({ PORT: 8080, DEBUG: false });
    });
  });

  describe("Runtime Proxy Edge Cases", () => {
    it("should throw error when accessing undeclared key", () => {
      const proxy = createEnv({ PORT: 3000 });
      expect(proxy.PORT).toBe(3000);
      expect(() => (proxy as any).NON_EXISTENT_KEY).toThrow('forgenv: Unknown env Key "NON_EXISTENT_KEY"');
    });

    it("should return undefined for .then access to prevent Promise unwrapping issues", () => {
      const proxy = createEnv({ PORT: 3000 });
      expect((proxy as any).then).toBeUndefined();
    });
  });

  describe("Cache Layer Edge Cases", () => {
    it("should return cached validation results for identical env input", () => {
      const schema: EnvSchema = {
        PORT: { type: "number", required: true },
      };
      const env = { PORT: "4000" };
      const firstRun = validateWithCache(env, schema);
      const secondRun = validateWithCache(env, schema);
      expect(firstRun).toEqual({ PORT: 4000 });
      expect(secondRun).toEqual(firstRun);
    });

    it("should compute different cache key when schema changes for identical env", () => {
      const env = { PORT: "5000" };
      const schemaA: EnvSchema = { PORT: { type: "number", min: 1000 } };
      const schemaB: EnvSchema = { PORT: { type: "number", min: 9000 } };

      expect(validateWithCache(env, schemaA)).toEqual({ PORT: 5000 });
      expect(() => validateWithCache(env, schemaB)).toThrow("is below minimum 9000");
    });
  });

  describe("Quoted Value & Type Coercion Edge Cases", () => {
    it("should validate native boolean true/false values in schema validation", () => {
      const schema: EnvSchema = {
        IS_ACTIVE: { type: "boolean", default: true },
        IS_DEBUG: { type: "boolean", default: false },
      };

      const result = validateEnv({}, schema);
      expect(result).toEqual({ IS_ACTIVE: true, IS_DEBUG: false });
    });

    it("should fail validation if empty string is passed to required number type", () => {
      const schema: EnvSchema = {
        PORT: { type: "number", required: true },
      };

      expect(() => validateEnv({ PORT: "" }, schema)).toThrow("Missing required env var: PORT");
    });
  });
});
