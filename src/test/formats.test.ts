import { describe, it, expect } from "vitest";
import { validateEnv } from "../core/validate.js";
import { inferSchemaFromEnv } from "../core/inferSchema.js";
import type { EnvSchema } from "../helper/types.js";

describe("All Supported Type & Format Validations Test Suite", () => {
  describe("Explicit Schema Validations", () => {
    it("should validate URL type and format", () => {
      const schema: EnvSchema = {
        SITE_URL: { type: "url", required: true },
        API_URL: { type: "format", format: "url", required: true },
      };

      const validEnv = {
        SITE_URL: "https://my-domain.org",
        API_URL: "http://localhost:3000/v1",
      };
      expect(validateEnv(validEnv, schema)).toEqual(validEnv);

      expect(() => validateEnv({ SITE_URL: "invalid-url", API_URL: "http://localhost" }, schema)).toThrow("Invalid URL for SITE_URL");
      expect(() => validateEnv({ SITE_URL: "https://valid.com", API_URL: "not-a-url" }, schema)).toThrow("Invalid URL for API_URL");
    });

    it("should validate Slug format", () => {
      const schema: EnvSchema = {
        CATEGORY_SLUG: { type: "format", format: "slug", required: true },
      };

      expect(validateEnv({ CATEGORY_SLUG: "tech-news-2026" }, schema)).toEqual({ CATEGORY_SLUG: "tech-news-2026" });
      expect(() => validateEnv({ CATEGORY_SLUG: "Tech News!" }, schema)).toThrow("Invalid slug for CATEGORY_SLUG");
    });

    it("should validate UUID format", () => {
      const schema: EnvSchema = {
        SESSION_ID: { type: "format", format: "uuid", required: true },
      };

      const validUuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      expect(validateEnv({ SESSION_ID: validUuid }, schema)).toEqual({ SESSION_ID: validUuid });
      expect(() => validateEnv({ SESSION_ID: "bad-uuid-123" }, schema)).toThrow("Invalid UUID for SESSION_ID");
    });

    it("should validate IP address format", () => {
      const schema: EnvSchema = {
        SERVER_IP: { type: "format", format: "ip", required: true },
      };

      expect(validateEnv({ SERVER_IP: "192.168.1.1" }, schema)).toEqual({ SERVER_IP: "192.168.1.1" });
      expect(() => validateEnv({ SERVER_IP: "300.0.0.1" }, schema)).toThrow("Invalid IP address for SERVER_IP");
    });

    it("should validate Email format", () => {
      const schema: EnvSchema = {
        CONTACT_EMAIL: { type: "format", format: "email", required: true },
      };

      expect(validateEnv({ CONTACT_EMAIL: "support@forgenv.dev" }, schema)).toEqual({ CONTACT_EMAIL: "support@forgenv.dev" });
      expect(() => validateEnv({ CONTACT_EMAIL: "invalid-email-at-domain" }, schema)).toThrow("Invalid email format for CONTACT_EMAIL");
    });
  });

  describe("Auto-Inferred Schema Formats", () => {
    it("should correctly auto-infer format types from raw environment values", () => {
      const rawEnv = {
        WEBSITE: "https://forgenv.dev",
        ADMIN_EMAIL: "admin@forgenv.dev",
        CLIENT_IP: "10.0.0.1",
        USER_ID: "123e4567-e89b-12d3-a456-426614174000",
        PROJECT_SLUG: "my-first-app",
        PORT_NUM: "8080",
        IS_ACTIVE: "true",
      };

      const inferred = inferSchemaFromEnv(rawEnv);

      expect(inferred.WEBSITE).toEqual({ type: "url", required: true });
      expect(inferred.ADMIN_EMAIL).toEqual({ type: "format", format: "email", required: true });
      expect(inferred.CLIENT_IP).toEqual({ type: "format", format: "ip", required: true });
      expect(inferred.USER_ID).toEqual({ type: "format", format: "uuid", required: true });
      expect(inferred.PROJECT_SLUG).toEqual({ type: "format", format: "slug", required: true });
      expect(inferred.PORT_NUM).toEqual({ type: "number", required: true });
      expect(inferred.IS_ACTIVE).toEqual({ type: "boolean", required: true });
    });
  });
});
