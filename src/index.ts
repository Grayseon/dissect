import { urlSchema, optionsSchema, selectorSchema } from "./lib/validators.mjs"
import { DissectOptions, DissectSelector, Results } from "./types/types.mjs"
import { iterateSelectors } from "./lib/selectorEval.mjs"
import Dissection from "./lib/Dissection.mjs"
import DissectionError from "./lib/DissectionError.mjs"
import ky from "ky"
import * as cheerio from "cheerio"

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
  T extends undefined ? Dissection : { [K in keyof T]: (string | string[])[] }
> {
  urlSchema.parse(url)
  
  if (selectors) selectorSchema.parse(selectors)

  const validatedOptions = optionsSchema.parse(options || {})
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
    return iterateSelectors(selectors as Results, dissection, validatedOptions) as T extends undefined
      ? Dissection
      : { [K in keyof T]: (string | string[])[] }
  } else {
    return dissection as T extends undefined ? Dissection : { [K in keyof T]: (string | string[])[] }
  }
}

export default dissect
