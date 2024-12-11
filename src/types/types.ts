import { optionsSchema, selectorSchema } from "../lib/validators"
import z from 'zod'

/**
 * Options for a dissection
 */
type DissectOptions = z.infer<typeof optionsSchema>

/**
 * The selectors of a dissection
 */
type DissectSelector = z.infer<typeof selectorSchema>

type Results = { [key: string]: (string | string[])[] } | {}

export { DissectOptions, DissectSelector, Results }