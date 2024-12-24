import { urlSchema, optionsSchema, selectorSchema } from "./lib/validators.mjs";
import { iterateSelectors } from "./lib/selectorEval.mjs";
import Dissection from "./lib/Dissection.mjs";
import DissectionError from "./lib/DissectionError.mjs";
import ky from "ky";
import * as cheerio from "cheerio";
/**
 * Dissects a webpage
 * @param {string} url URL to dissect
 * @param {object} [selectors] CSS selectors to grab
 * @param {DissectOptions} options Additional dissection options
 * @returns {object|Dissection} Results of the search. If no selectors are initially provided, it will return a Dissection constructor.
 * @throws {Error} Errors may be thrown due to network errors or invalid inputs
 */
async function dissect(url, selectors, options) {
    urlSchema.parse(url);
    if (selectors)
        selectorSchema.parse(selectors);
    const validatedOptions = optionsSchema.parse(options || {});
    let response;
    let $;
    try {
        response = await ky(url).text();
        $ = cheerio.load(response);
    }
    catch (e) {
        throw new DissectionError(`Error while processing URL: ${e}`);
    }
    const dissection = new Dissection($, validatedOptions);
    if (selectors) {
        return iterateSelectors(selectors, dissection, validatedOptions);
    }
    else {
        return dissection;
    }
}
export default dissect;
//# sourceMappingURL=index.js.map