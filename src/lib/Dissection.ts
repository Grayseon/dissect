import { optionsSchema } from './validators.js'
import { DissectOptions } from '../types/types.js'
import { Cheerio, CheerioAPI } from 'cheerio'

function processAllOptions(
  $: CheerioAPI,
  elements: Cheerio<any>,
  options: DissectOptions
): string[] | CheerioAPI[] {
  return options.postProcessing(
    elements
      .map((_, el) => {
        const element = $(el)
        if (options.extract == 'text') return element.text()?.trim()
        if (options.extract == 'html') return element.html()?.trim()
        if (options.extract == 'element') return element
        if (options.extract == 'attr' && options.attr)
          return element.attr(options.attr)?.trim() || null
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
  get(selector: string, options: DissectOptions = this.options): any[] {
    const elements = this.$(selector)
    let returnValue = []
    options = optionsSchema.parse(options)

    if (!elements.length) {
      return []
    }

    if (options.extract == 'element') {
      returnValue = processAllOptions(this.$, elements, options) as CheerioAPI[]
    } else {
      returnValue = processAllOptions(this.$, elements, options) as string[]
    }

    return returnValue
  }
}

export default Dissection
