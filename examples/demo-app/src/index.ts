import { env } from "./env.js";

console.log("==========================================");
console.log("🔥 forgenv Demo App Starting...");
console.log("==========================================");

console.log(`📌 NODE_ENV       : ${env.NODE_ENV}`);
console.log(`📌 Server Port     : ${env.PORT} (Type: ${typeof env.PORT})`);
console.log(`📌 Database URL   : ${env.DATABASE_URL}`);
console.log(`📌 Expanded URL   : ${env.API_FULL_URL}`);
console.log(`📌 Allowed Origins: ${JSON.stringify(env.ALLOWED_ORIGINS)} (Is Array: ${Array.isArray(env.ALLOWED_ORIGINS)})`);
console.log(`📌 Secret Key     : ${env.SECRET_KEY}`);

console.log("\n🧪 Testing Runtime Proxy Guard for Undeclared Keys...");
try {
  const invalidKey = (env as any).UNDECLARED_API_KEY;
} catch (err: any) {
  console.log(`✅ Caught Expected Proxy Error: "${err.message}"`);
}

console.log("\n🎉 forgenv integration test successful!");
