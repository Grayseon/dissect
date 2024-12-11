import { optionsSchema, selectorSchema } from "../lib/validators"
import z from 'zod'

type DissectOptions = z.infer<typeof optionsSchema>
type DissectSelector = z.infer<typeof selectorSchema>

export { DissectOptions, DissectSelector }