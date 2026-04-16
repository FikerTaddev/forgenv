export type EnvType = 'string' | 'boolean' | 'number';

export type EnvRule = {
    type: EnvType;
    required?: boolean;
    length?:number;
    
}


export type EnvSchema = Record<string, EnvRule>;

