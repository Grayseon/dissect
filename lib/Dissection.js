/** @typedef {import('../types/types').DissectOptions} */
import { optionsSchema } from './validators.js'

/** Dissection for a page. Allows you to get data from a page after-the-fact */
class Dissection {
  /**
   * 
   * @param {import("cheerio").CheerioAPI} $ 
   * @param {DissectOptions} options Additional dissection options
   * @see {@link DissectOptions} for more information about DissectOptions
   */
  constructor($, options) {
    this.$ = $
    this.options = options
  }

  /**
   * 
   * @param {object} selector CSS selector to grab
   * @param {DissectOptions} [options] Additional dissection options. Only use if you want to override the initial constructor options
   * @see {@link DissectOptions} for more information about DissectOptions
   * @returns {}
   */
  get(selector, options = this.options) {
    const elements = this.$(selector)
    if(!options.filter) console.error('HELP ME HELP ME HELP ME')
    if(options.filter) console.error('filter already exists!')
    console.log(options.filter.toString())
    options = optionsSchema.parse(options)
    if(!options.filter) console.error('HELP ME HELP ME HELP ME')
    if(options.filter) console.error('filter exists now!')
    console.log(options.filter.toString())
    
    if (!elements.length) {
      return null
    }
    
    return /*options.postProcessing(*/ elements.map((_, el) => {
        const element = this.$(el)
        if (options.extract == 'text') return element.text().trim()
        if (options.extract == 'html') return element.html()?.trim()
        if (options.extract == 'element') return element
        if (options.extract == 'attr') return element.attr(options.attr).trim() || null
        return null
      })
      .filter(options.filter)
      .get()
      //.map(options.map)
    //)
  }
}

export default Dissection