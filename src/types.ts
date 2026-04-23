export type PrimitiveType = string | boolean | number;
export type ProtocolsType = "http" | "https" | "ftp";
type BaseField = {
  required?: boolean;
  length?: number;
  sensetive?: boolean;
};

type EnumField<T extends readonly PrimitiveType[]> = BaseField & {
  enum: T;
  default?: T[number];
  caseSensetive?: boolean;
};

type NumberField = BaseField & {
  type: "number";
  default?: number;
};
type StringField = BaseField & {
  type: "string";
  minLength?: number;
  maxLength?: number;
  default?: string;
};
type BooleanField = BaseField & {
  type: "boolean";
  default?: boolean;
};
type UrlField = BaseField & {
  type: "url";
  protocols?: ProtocolsType[];
  hostname?: string;
  default?:URL;
};
type EnvField =
  | StringField
  | NumberField
  | BooleanField
  | UrlField
  | EnumField<readonly PrimitiveType[]>;
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
  | "INAVLID_URL"
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

export type EnvSchema = Record<string, EnvField>;

let a : EnvSchema = {
  H:{enum : []}
}
