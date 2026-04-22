import type { EnvGuardError } from "../types.ts";
import { log } from "../helper/chalk.ts";

export const std: any = {};

std.CreateError = (params: EnvGuardError): EnvGuardError => {
  return {
    Key: params.Key,
    type: params.type,
    message: params.message,
    expected: params?.expected,
    received: params?.received,
    value: params.value ?? params.received,
    location: {
      file: params.location?.file,
      line: params.location?.line,
    },
    rule: params?.rule,
  };
};

std.FormatError = (err: EnvGuardError): string => {
  return `${err.type} :: ${err.Key}`;
};


std.LogError = (err: EnvGuardError) => {
  log.error(std.FormatError(err), err.message);
};