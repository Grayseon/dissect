import { optionsSchema } from './validators'
import { DissectOptions } from "../types/types"
import { Cheerio, CheerioAPI } from 'cheerio'

function processAllOptions($: CheerioAPI, elements: Cheerio<any>, options: DissectOptions): string[] | CheerioAPI[] {
  return options.postProcessing(elements.map((_, el) => {
    const element = $(el)
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
  get(selector: string, options: DissectOptions = this.options): string[] | CheerioAPI[] {
    const elements = this.$(selector)
    options = optionsSchema.parse(options)
    
    if (!elements.length) {
      return []
    }
    
    if(options.extract == "element") {
      return processAllOptions(this.$, elements, options) as CheerioAPI[]
    } else {
      return processAllOptions(this.$, elements, options) as string[]
    }
  }
}

export default Dissection