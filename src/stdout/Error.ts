import type { forgenvError } from "../helper/types.js";
import consola from "consola";
import signale from "signale";

export const std: any = {};

std.CreateError = (params: forgenvError): forgenvError => {
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

std.FormatError = (err: forgenvError): string => {
  return `${err.type} :: ${err.Key}`;
};

std.LogError = (err: forgenvError) => {
  consola.error(std.FormatError(err));
  signale.error(err.message);
};
