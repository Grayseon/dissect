import { z } from "zod";
declare const urlSchema: z.ZodString;
declare const optionsSchema: z.ZodEffects<z.ZodObject<{
    extract: z.ZodDefault<z.ZodEnum<["text", "html", "attr", "element"]>>;
    attr: z.ZodOptional<z.ZodString>;
    arrayType: z.ZodDefault<z.ZodEnum<["priority", "all", "flatAll"]>>;
    maxDepth: z.ZodDefault<z.ZodNumber>;
    filter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodAny>>;
    map: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodAny>>;
    postProcessing: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    extract: "text" | "html" | "attr" | "element";
    arrayType: "priority" | "all" | "flatAll";
    maxDepth: number;
    map: (args_0: any, ...args: unknown[]) => any;
    filter: (args_0: any, ...args: unknown[]) => any;
    postProcessing: (args_0: any, ...args: unknown[]) => any;
    attr?: string | undefined;
}, {
    attr?: string | undefined;
    extract?: "text" | "html" | "attr" | "element" | undefined;
    arrayType?: "priority" | "all" | "flatAll" | undefined;
    maxDepth?: number | undefined;
    map?: ((args_0: any, ...args: unknown[]) => any) | undefined;
    filter?: ((args_0: any, ...args: unknown[]) => any) | undefined;
    postProcessing?: ((args_0: any, ...args: unknown[]) => any) | undefined;
}>, {
    extract: "text" | "html" | "attr" | "element";
    arrayType: "priority" | "all" | "flatAll";
    maxDepth: number;
    map: (args_0: any, ...args: unknown[]) => any;
    filter: (args_0: any, ...args: unknown[]) => any;
    postProcessing: (args_0: any, ...args: unknown[]) => any;
    attr?: string | undefined;
}, {
    attr?: string | undefined;
    extract?: "text" | "html" | "attr" | "element" | undefined;
    arrayType?: "priority" | "all" | "flatAll" | undefined;
    maxDepth?: number | undefined;
    map?: ((args_0: any, ...args: unknown[]) => any) | undefined;
    filter?: ((args_0: any, ...args: unknown[]) => any) | undefined;
    postProcessing?: ((args_0: any, ...args: unknown[]) => any) | undefined;
}>;
declare const selectorSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<any, z.ZodTypeDef, any>>>;
export { urlSchema, selectorSchema, optionsSchema };
