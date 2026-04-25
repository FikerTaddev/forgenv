# EnvGuard

EnvGuard is a lightweight environment validation tool for Node.js and TypeScript projects. It ensures your environment variables are correctly defined before your app starts.
## WIP 

## Installation

```bash 
npm install forgenv
```

or
```bash 
npm install -D forgenv
```
## Schema Setup

Create a schema file (env.schema.ts):
```typescript
export default {
  NODE_ENV: {
    enum: ["dev", "prod", "test"],
    required: true
  },

  PORT: {
    type: "number",
    default: 3000
  },

  DATABASE_URL: {
    type: "string",
    required: true
  }
};
```
## .env Example
```dotenv
NODE_ENV=dev  
PORT=3000  
DATABASE_URL=postgres://localhost:5432/db
```
## CLI Usage
```bash
forgenv check --schema ./env.schema.ts --env .env
```
## Example Output
```Error
❌ EnvGuard failed

Invalid value for NODE_ENV  
Expected: dev | prod | test  
Received: staging
```
## Exit Codes

0 → success  
1 → validation failed  

Used in CI/CD like:
```bash
forgenv check && echo "OK"
```
## Supported Types

- string
- number
- boolean
- enum
- url (basic validation)

## Philosophy

Prevent production failures caused by invalid environment configuration.

## Status

Early-stage CLI tool focused on:
- Core validation engine
- CLI usability
- Schema-driven validation
- Safe startup enforcement
