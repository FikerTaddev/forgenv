export type EnvType = "string" | "boolean" | "number";

export type EnvRule = {
  type: EnvType;
  required?: boolean;
  length?: number;
};
export type ErrorType =
  | "TYPE_MISMATCH"
  | "INVALID_NUMBER"
  | "INVALID_BOOLEAN"
  | "MISSING_KEY"
  | "EMPTY_VALUE"
  | "INVALID_FORMAT"
  | "INVALID_URL"
  | "INVALID_EMAIL"
  | "INVALID_REGEX_MATCH"
  | "OUT_OF_RANGE"
  | "VALUE_TOO_SHORT"
  | "VALUE_TOO_LONG"
  | "INVALID_ENUM_VALUE"
  | "DUPLICATE_KEY"
  | "UNSAFE_IN_PRODUCTION"
  | "MISSING_PROD_REQUIRED_KEY"
  | "DEPRECATED_KEY"
  | "INVALID_SCHEMA";

export type EnvGuardError = {
  Key: string;
  type: ErrorType;
  message: string;
  expected?: any;
  received?: any;
  value?: any;
  location: {
    file?: string;
    line?: number;
  };
  rule?: string; //which schema rule triggered the error
};

export type EnvSchema = Record<string, EnvRule>;
