import { describe, it, expect } from "vitest";
import { defineEnv } from "../index.js";

describe("defineEnv", () => {
  it("returns validated env object", () => {
    const result = defineEnv(
      ["test/.env.test"],
      {
        PORT: { type: "number", required: true },
        DEBUG: { type: "boolean", required: true }
      }
    );

    expect(result).toBeDefined();
  });
});