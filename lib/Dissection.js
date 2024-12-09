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
    options = optionsSchema.parse(options)
    
    if (!elements.length) {
      return []
    }
    
    return options.postProcessing(elements.map((_, el) => {
        const element = this.$(el)
        if (options.extract == 'text') return element.text()?.trim()
        if (options.extract == 'html') return element.html()?.trim()
        if (options.extract == 'element') return element
        if (options.extract == 'attr') return element.attr(options.attr)?.trim() || null
        return []
      })
      .get()
      .filter(options.filter)
      .map(options.map)
    )
  }
}

export default Dissection