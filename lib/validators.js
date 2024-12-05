import { z } from "zod"

const urlSchema = z.string('URL must be a string').url('URL must be a valid URL').min(1, 'URL most be a valid, non-empty string')
const optionsSchema = z.object({
  extract: z.enum(['text', 'html', 'attr', 'element'], {message: "Extraction type must be either 'text', 'html', 'element', or 'attr'."}).default('text'),
  attr: z.string().optional(),
  filter: z.function().default(() => () => true)
}).refine(
  (data) => data.extract !== 'attr' || (data.extract === 'attr' && data.attr),
  {message: "If extraction type is 'attr', the 'attr' field must be provided."}
)
const selectorSchema = z.record(z.string().min(1, 'Key must be non-empty'), z.string().min(1, 'Value must be non-empty').or(z.tuple([z.string(), optionsSchema]))).optional()

export { urlSchema, selectorSchema, optionsSchema }