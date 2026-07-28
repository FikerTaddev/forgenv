# forgenv 🔥

[![npm version](https://img.shields.io/npm/v/forgenv.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/forgenv)
[![CI](https://img.shields.io/github/actions/workflow/status/FikerTaddev/forgenv/ci.yml?branch=main&label=CI&style=flat-square)](https://github.com/FikerTaddev/forgenv/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/forgenv.svg?style=flat-square&color=blue)](LICENSE)
![dependencies](https://img.shields.io/badge/dependencies-0-success?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)

**forgenv** is a high-performance, zero-config, zero-dependency environment validation and type-safety engine for Node.js & TypeScript applications.

It guarantees that your environment variables match your requirements before your application boots, while providing **automatic zero-config schema inference**, **runtime proxy protection**, **variable expansion**, **secret masking**, and **SHA256 validation caching**.

---

## ✨ Key Features

- ⚡ **Zero-Config Out-of-the-Box**: Pass nothing to `defineEnv()`—it automatically parses `.env` and infers type formats (`number`, `boolean`, `url`, `email`, `uuid`, `slug`, `ip`, `string`).
- 🛡️ **Runtime Proxy Protection**: Prevents silent `undefined` key accesses by throwing explicit runtime errors when accessing undeclared environment keys.
- 🔀 **Variable Expansion (`${VAR}`)**: Supports inline variable substitution directly inside `.env` files.
- 🔒 **Secret & Sensitive Data Masking**: Automatically redacts sensitive fields (`sensitive: true`) to `[REDACTED]` in error logs.
- ⚡ **Built-in Validation Caching**: SHA256 hashes raw environment payloads to skip redundant validations on cold starts.
- 🚨 **Production Mode Guards**: Enforce `disallowDefaultInProduction` to prevent accidental dev default fallback usage in production.
- 🧪 **Rich Type & Format Validation**: Native support for `string`, `number`, `boolean`, `url`, `enum`, `email`, `uuid`, `slug`, and `ip`.
- 💻 **Scaffolding & Type Generation CLI**: Zero-flag validation (`npx forgenv`), scaffolding (`npx forgenv init`), and ambient type definition generation (`npx forgenv generate`).

---

## 📦 Installation

```bash
npm install forgenv
```

---

## 🚀 Quick Start

### 1. Zero-Config Mode (No Schema required)

```typescript
import { defineEnv } from "forgenv";

// Auto-detects .env & infers types automatically
export const env = defineEnv();

console.log(env.PORT); // Auto-inferred
```

### 2. Schema-Driven Mode (Strict Validation & Transforms)

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

### 3. Access Variables Safely

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
const env = defineEnv();

console.log(env.API_URL); // Output: http://localhost:8080/v1
```

---

## 🛠️ CLI Usage

`forgenv` includes a zero-config CLI for validation, scaffolding, and type generation.

### Zero-Config CLI Validation
```bash
npx forgenv
```

### Scaffolding Config & Schema
```bash
npx forgenv init
```

### Generating Ambient TypeScript Types (`env.d.ts`)
```bash
npx forgenv generate
```

---

## 📜 License

MIT License © 2026 FikerTaddev
