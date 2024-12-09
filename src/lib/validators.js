import { z } from "zod"

const urlSchema = z.string('URL must be a string').url('URL must be a valid URL').min(1, 'URL most be a valid, non-empty string')

const optionsSchema = z.object({
  extract: z.enum(['text', 'html', 'attr', 'element'], { message: "Extraction type must be either 'text', 'html', 'element', or 'attr'." }).default('text'),
  attr: z.string().optional(),
  arrayType: z.enum(['priority', 'all', 'flatAll'], { message: "Array type must be either 'priority', 'all', or 'flatAll'" }).default('flatAll'),
  maxDepth: z.number().positive('Recursion depth must be positive').default(5),
  filter: z.function().returns(z.void()).default(() => () => true),
  map: z.function().returns(z.void()).default(() => (data) => data),
  postProcessing: z.function().returns(z.void).default(() => (data) => (data))
}).refine(
  (data) => data.extract !== 'attr' || (data.extract === 'attr' && data.attr),
  { message: "If extraction type is 'attr', the 'attr' field must be provided." }
)

const selectorValueTupleSchema = z.lazy(() => (
  z.tuple([z.union([
    z.string(),
    selectorValueSchema
  ]), optionsSchema])
))

const selectorValueSchema = z.lazy(() => (
  z.union([
    z.string().min(1, 'Value must be non-empty'),
    selectorValueTupleSchema,
    z.array(z.union([
      z.string(),
      selectorValueTupleSchema
    ]))
  ])
))

const selectorSchema = z.record(z.string().min(1, 'Key must be non-empty'), selectorValueSchema)

export { urlSchema, selectorSchema, optionsSchema }