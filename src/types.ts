export type EnvType = 'string' | 'boolean' | 'number';

export type EnvRule = {
    type: EnvType;
    required?: boolean;
}


export type EnvSchema = Record<string, EnvRule>;

