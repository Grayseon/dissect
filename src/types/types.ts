import { optionsSchema, selectorSchema } from "../lib/validators"
import z from 'zod'

/**
 * Options for a dissection
 */
type DissectOptions = Readonly<z.infer<typeof optionsSchema>>

/**
 * The selectors of a dissection
 */
type DissectSelector = Readonly<z.infer<typeof selectorSchema>>

type Results<K extends string = string> = { [key in K]: (string | string[])[] }

interface SelectorPair {
  selectors: string | string[];
  options: DissectOptions;
}

export { DissectOptions, DissectSelector, Results, SelectorPair }