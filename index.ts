import ky from "ky"
import * as cheerio from "cheerio"
import { urlSchema, optionsSchema, selectorSchema } from "./lib/validators.js"
import { iterateSelectors } from "./lib/selectorEval.js"
import Dissection from "./lib/Dissection.js"
import { DissectOptions } from "./types/types.js"

/**
 * Dissects a webpage
 * @param {string} url URL to dissect
 * @param {object} [selectors] CSS selectors to grab
 * @param {DissectOptions} options Additional dissection options
 * @see {@link DissectOptions} for more information about DissectOptions
 * @returns {object|Dissection} Results of the search. If no selectors are initially provided, it will return a Dissection constructor.
 * @throws {Error} Errors may be thrown due to network errors or invalid inputs
 */
async function dissect<T extends Record<string, any[]>>(
  url: string,
  selectors?: T,
  options: DissectOptions
): Promise<
  T extends undefined ? Dissection : { [K in keyof T]: string }
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
    throw new Error(`Error while processing URL: ${e}`)
  }

  const dissection = new Dissection($, validatedOptions)

  if (selectors) {
    return iterateSelectors(selectors, dissection, validatedOptions)
  } else {
    return dissection as T extends undefined ? Dissection : never
  }
}

export default dissect