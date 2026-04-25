export type PrimitiveType = string | boolean | number;
export type ProtocolsType = "http" | "https" | "ftp";
export type FormatType = "email" | "uuid" | "slug" | "ip" | "url";
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
type FormatField = BaseField & {
  type: "format";
  format: FormatType;
  default?:typeof String;
};
type EnvField =
  | StringField
  | NumberField
  | BooleanField
  | UrlField
  | FormatField
  | EnumField<readonly PrimitiveType[]>;

 export type InferField<T> =
  T extends { enum: readonly (infer U)[] } ? U :
  T extends { type: "number" } ? number :
  T extends { type: "boolean" } ? boolean :
  T extends { type: "string" } ? string :
  T extends { default: infer D } ? D :
  string;
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: forgenvError };
  export type InferSchema<T> = {
    [K in keyof T ] :InferField<T[K]>
  }
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

export type forgenvError = {
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


