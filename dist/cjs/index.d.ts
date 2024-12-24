import { DissectOptions, DissectSelector } from "./types/types.mjs";
import Dissection from "./lib/Dissection.mjs";
/**
 * Dissects a webpage
 * @param {string} url URL to dissect
 * @param {object} [selectors] CSS selectors to grab
 * @param {DissectOptions} options Additional dissection options
 * @returns {object|Dissection} Results of the search. If no selectors are initially provided, it will return a Dissection constructor.
 * @throws {Error} Errors may be thrown due to network errors or invalid inputs
 */
declare function dissect<T extends DissectSelector>(url: string, selectors?: T, options?: DissectOptions): Promise<T extends undefined ? Dissection : {
    [K in keyof T]: (string | string[])[];
}>;
export default dissect;
