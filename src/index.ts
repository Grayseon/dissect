import ky from "ky"
import * as cheerio from "cheerio"
import { urlSchema, optionsSchema, selectorSchema } from "./lib/validators"
import { iterateSelectors } from "./lib/selectorEval"
import Dissection from "./lib/Dissection"
import DissectionError from "./lib/DissectionError"
import { DissectOptions, DissectSelector, Results } from "./types/types"

/**
 * Dissects a webpage
 * @param {string} url URL to dissect
 * @param {object} [selectors] CSS selectors to grab
 * @param {DissectOptions} options Additional dissection options
 * @returns {object|Dissection} Results of the search. If no selectors are initially provided, it will return a Dissection constructor.
 * @throws {Error} Errors may be thrown due to network errors or invalid inputs
 */
async function dissect<T extends DissectSelector>(
  url: string,
  selectors?: T,
  options?: DissectOptions
): Promise<
  T extends undefined ? Dissection : { [K in keyof T]: (string|string[])[]}
> {
  urlSchema.parse(url)
  selectorSchema.parse(selectors)
  const validatedOptions = optionsSchema.parse(options)
  let response: string
  let $: cheerio.CheerioAPI

  try {
    response = await ky(url).text()
    $ = cheerio.load(response)
  } catch (e) {
    throw new DissectionError(`Error while processing URL: ${e}`)
  }

  const dissection = new Dissection($, validatedOptions)

  if (selectors) {
    return iterateSelectors(selectors as Results, dissection, validatedOptions) as unknown as T extends undefined ? Dissection : { [K in keyof T]: (string|string[])[]}
  } else {
    return dissection as T extends undefined ? Dissection : { [K in keyof T]: (string|string[])[]}
  }
}

/**
 * Organize your options better
 * @param selectors 
 * @param options 
 * @returns 
 */
function withOptions(selectors: DissectSelector, options: DissectOptions): [DissectSelector, DissectOptions] {
  return [selectors, options]
}

export default dissect
export { withOptions }