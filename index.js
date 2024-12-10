/** @typedef {import('../types/types').DissectOptions} */
import ky from "ky"
import * as cheerio from "cheerio"
import { urlSchema, optionsSchema, selectorSchema } from "./lib/validators.js"
import { iterateSelectors } from "./lib/selectorEval.js"
import Dissection from "./lib/Dissection.js"

/**
 * Dissects a webpage
 * @param {string} url URL to dissect
 * @param {object} [selectors] CSS selectors to grab
 * @param {DissectOptions} options Additional dissection options
 * @see {@link DissectOptions} for more information about DissectOptions
 * @returns {object|Dissection} Results of the search. If no selectors are initially provided, it will return a Dissection constructor.
 * @throws {Error} Errors may be thrown due to network errors or invalid inputs
 */
async function dissect(url, selectors = undefined, options = {}) {
  urlSchema.parse(url)
  selectorSchema.parse(selectors)
  const validatedOptions = optionsSchema.parse(options)
  let response
  let $

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
    return dissection
  }
}

export default dissect