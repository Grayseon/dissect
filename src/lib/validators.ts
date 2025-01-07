import { z } from 'zod'

const urlSchema = z
  .string()
  .url('URL must be a valid URL')
  .min(1, 'URL most be a valid, non-empty string')

const optionsSchema = z
  .object({
    extract: z
      .enum(['text', 'html', 'attr', 'element'], {
        message:
          "Extraction type must be either 'text', 'html', 'element', or 'attr'."
      })
      .default('text')
      .describe('The item to look for'),
    attr: z
      .string()
      .optional()
      .describe(
        'The attribute to look for. Only used and required if extract is attr.'
      ),
    arrayType: z
      .enum(['priority', 'all', 'flatAll'], {
        message: "Array type must be either 'priority', 'all', or 'flatAll'"
      })
      .default('flatAll')
      .describe('The behavior of the output of multiple selectors'),
    maxDepth: z
      .number()
      .positive('Recursion depth must be positive')
      .default(5)
      .describe('Change the recursion depth of recursive processes'),
    filter: z
      .function()
      .args(z.any())
      .returns(z.any())
      .default(() => () => true)
      .describe(
        'Filters can include or exclude each individual element of an array of a selector result'
      ),
    map: z
      .function()
      .args(z.any())
      .returns(z.any())
      .default(() => (data: string) => data)
      .describe(
        'Maps are applied granularly to each individual element of the array of a selector result'
      ),
    postProcessing: z
      .function()
      .args(z.any())
      .returns(z.any())
      .default(() => (data: string[]) => data)
      .describe(
        'Post-processing is applied to the topmost array of the selector result'
      )
  })
  .refine(
    (data) => data.extract !== 'attr' || (data.extract === 'attr' && data.attr),
    {
      message:
        "If extraction type is 'attr', the 'attr' field must be provided."
    }
  )

const selectorValueTupleSchema: z.ZodSchema = z.lazy(() =>
  z.tuple([z.union([z.string(), selectorValueSchema]), optionsSchema])
)

const selectorValueSchema: z.ZodSchema = z.lazy(() =>
  z.union([
    z.string().min(1, 'Value must be non-empty'),
    selectorValueTupleSchema,
    z.array(z.union([z.string(), selectorValueTupleSchema]))
  ])
)

const selectorSchema = z
  .record(z.string().min(1, 'Key must be non-empty'), selectorValueSchema)
  .optional()

export { urlSchema, selectorSchema, selectorValueSchema, optionsSchema }
