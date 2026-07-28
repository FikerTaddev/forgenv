# forgenv 🔥

**forgenv** is a high-performance, zero-dependency environment validation and type-safety library for Node.js & TypeScript applications.

It guarantees that your environment variables match your strict schema requirements before your application boots, while providing **runtime proxy protection**, **automatic variable expansion**, **secret masking**, and **SHA256 validation caching**.

---

## ✨ Key Features

- 🛡️ **Runtime Proxy Protection**: Prevents silent `undefined` key accesses by throwing explicit errors at runtime.
- 🔀 **Variable Expansion (`${VAR}`)**: Supports variable substitution directly inside `.env` files.
- 🔒 **Secret & Sensitive Data Masking**: Automatically redacts sensitive fields (`sensitive: true`) to `[REDACTED]` in error logs.
- ⚡ **Built-in Validation Caching**: SHA256 hashes raw environment payloads to skip redundant validations on cold starts.
- 🚨 **Production Mode Guards**: Enforce `disallowDefaultInProduction` to prevent accidental dev default fallback usage in production.
- 🧪 **Rich Type & Format Validation**: Full support for `string`, `number`, `boolean`, `url`, `enum`, `email`, `uuid`, `slug`, and `ip`.
- 🛠️ **Custom Transformer Hooks**: Post-process validated values (e.g. converting CSV strings to arrays).
- 💻 **Scaffolding CLI**: Quick scaffolding (`forgenv init`) and CLI validation (`forgenv check`).

---

## 📦 Installation

```bash
npm install forgenv
```

---

## 🚀 Quick Start

### 1. Define Environment Schema & Load

```typescript
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
    sensitive: true, // Redacts value in error logs
  },

  API_KEY: {
    type: "string",
    default: "dev-key-123",
    disallowDefaultInProduction: true, // Throws in NODE_ENV=production
  },

  ALLOWED_ORIGINS: {
    type: "string",
    required: true,
    transform: (val) => val.split(",").map((s) => s.trim()),
  },
});
```

### 2. Access Variables Safely

```typescript
console.log(env.PORT); // 3000 (typed as number)
console.log(env.ALLOWED_ORIGINS); // ["http://localhost"] (typed as string[])

// ❌ Accessing undeclared keys throws an immediate runtime error:
console.log(env.NON_EXISTENT_KEY); 
// Error: forgenv: Unknown env Key "NON_EXISTENT_KEY"
```

---

## 🔀 Variable Expansion Example (`.env`)

```dotenv
HOST=localhost
PORT=8080
API_URL=http://${HOST}:${PORT}/v1
```

```typescript
const env = defineEnv([".env"], {
  API_URL: { type: "format", format: "url", required: true },
});

console.log(env.API_URL); // Output: http://localhost:8080/v1
```

---

## 🛠️ CLI Usage

`forgenv` provides a built-in CLI tool for project initialization and CI/CD validation.

### Scaffolding Config & Schema
```bash
npx forgenv init
```

### Validating Environment in CI/CD
```bash
npx forgenv check --env .env --schema ./config/env.schema.ts
```

---

## 📜 License

ISC License © 2026
