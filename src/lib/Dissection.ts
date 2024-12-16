import { optionsSchema } from './validators.ts'
import { DissectOptions } from "../types/types.ts"
import { CheerioAPI } from 'cheerio'

/** Dissection for a page. Allows you to get data from a page after-the-fact */
class Dissection {
  $: CheerioAPI
  options: DissectOptions

  /**
   * 
   * @param {CheerioAPI} $ 
   * @param {DissectOptions} options Additional dissection options
   */
  constructor($: CheerioAPI, options: DissectOptions) {
    this.$ = $
    this.options = options
  }

  /**
   * 
   * @param {string} selector CSS selector to grab
   * @param {DissectOptions} [options] Additional dissection options. Only use if you want to override the initial constructor options
   */
  get(selector: string, options: DissectOptions = this.options): string | string[] {
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
        if (options.extract == 'attr' && options.attr) return element.attr(options.attr)?.trim() || null
        return []
      })
      .get()
      .filter(options.filter)
      .map(options.map)
    )
  }
}

export default Dissection