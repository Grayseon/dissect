import { DissectOptions } from '../types/types.mjs';
import { CheerioAPI } from 'cheerio';
/** Dissection for a page. Allows you to get data from a page after-the-fact */
declare class Dissection {
    $: CheerioAPI;
    options: DissectOptions;
    /**
     *
     * @param {CheerioAPI} $
     * @param {DissectOptions} options Additional dissection options
     */
    constructor($: CheerioAPI, options: DissectOptions);
    /**
     *
     * @param {string} selector CSS selector to grab
     * @param {DissectOptions} [options] Additional dissection options. Only use if you want to override the initial constructor options
     */
    get(selector: string, options?: DissectOptions): any[];
}
export default Dissection;
