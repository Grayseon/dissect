import ky from "ky"
import * as cheerio from "cheerio"

/**
 * Dissects a webpage
 * @param {string} url
 * @param {object} selectors
 * @returns {object} Results of the search
 */
async function dissect(url, selectors){
  if(typeof url !== "string") throw new Error('No URL provided')
  if(typeof selectors !== "object") throw new Error('No selectors provided')

  const response = await ky(url).text()
  const $ = cheerio.load(response)
  let results = {}

  Object.entries(selectors).forEach(([name, selector])=>{
    const el = $(selector)
    
    if(el.length > 1){
      let elementList = []
      el.each((_, element)=>{
        elementList.push($(element).text())
      })

      results[name] = elementList
    }else{
      results[name] = el.text()
    }
  })

  return results
}

export { dissect }