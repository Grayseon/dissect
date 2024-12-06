import ky from "ky"
import * as cheerio from "cheerio"
import { urlSchema, optionsSchema, selectorSchema } from "./lib/validators.js"
import Dissection from "./lib/Dissection.js"

/** @typedef {import('../types/types').DissectOptions} */

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

  try {
    const response = await ky(url).text()
    const $ = cheerio.load(response)
    const dissection = new Dissection($, validatedOptions)

    let results = {}

    if (selectors) {
      for (const [key, selector] of Object.entries(selectors)) {
        if (selector instanceof Array) {
          // User changed opts midway
          results[key] = dissection.get(selector[0], selector[1])
        } else {
          results[key] = dissection.get(selector)
        }
      }
      return results
    } else {
      return dissection
    }
  } catch (e) {
    throw new Error(`Unable to dissect ${e}`)
  }
}

export default dissect