export function createEnv(env:Record<string,any>) {
  return new Proxy(env, {
    get(target, key: string) {
      if (!(key in target)) {
        throw new Error(`forgenv: Unknown env Key "${key}"`);
      }
      return target[key];
    },
  });
}
