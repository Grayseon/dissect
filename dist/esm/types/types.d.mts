import { optionsSchema, selectorSchema, selectorValueSchema } from '../lib/validators.mjs';
import z from 'zod';
/**
 * Options for a dissection
 */
type DissectOptions = Readonly<z.infer<typeof optionsSchema>>;
/**
 * The selectors of a dissection
 */
type DissectSelector = Readonly<z.infer<typeof selectorSchema>>;
/**
 * The value of a key in the selectors of a dissection
 */
type DissectSelectorValueSchema = z.infer<typeof selectorValueSchema>;
/**
 * The results of a selection. User might make the key anything.
 * @example
 * {
 *  "title": ["The Verge"],
 *  "p": [ (cheerio element) ]
 *  "author": [
 *    [
 *      "John Doe"
 *    ],
 *    [
 *      "Jane Doe"
 *    ]
 *  ]
 * }
 */
type Results = {
    [key: string]: any[];
};
interface SelectorPair {
    selectors: string | string[];
    options: DissectOptions;
}
export { DissectOptions, DissectSelector, Results, SelectorPair, DissectSelectorValueSchema };
