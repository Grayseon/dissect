import { DissectOptions, DissectSelector, Results } from "../types/types"
import Dissection from "./Dissection"

function addToResults(key: string, value: any, results: Results): object {
  if (!value) return results
  if (Array.isArray(results)) { // Selectors will be an array if the user uses multiple selectors in the same selector key. title: ['title', 'meta[type="og:title"']]
    results.push(value)
  } else {
    results[key] = results[key] ? [...results[key], ...value] : [...value]
  }
  return results
}

function processSelectorArray(selectors: DissectSelector, key: string, dissection: Dissection, options: DissectOptions, results: Results, depth: number) {
  const iterations: any[] = iterateArraySelectors(selectors, dissection, options, depth + 1)

  // Every output is checked if existant. If it is null it returns []. This might be triggered if there are no selectors or if the filter filters everything out.
  switch (options.arrayType) {
    case 'all': // Every selector is added to results, all in groups of arrays per selector
      addToResults(key, iterations || [], results)
      break
    case 'flatAll': // Every selector is added to results, but they are ungrouped. This is the default arrayType
      addToResults(key, iterations.flat() || [], results)
      break
    case 'priority': // Only the first non-empty selector is added to the results.
      const firstNonEmpty = iterations.find((item: string | any[]) => item.length > 0)
      addToResults(key, firstNonEmpty || [], results)
      break
  }

  return results
}

function iterateSelectors<T extends object>(selectors: T, dissection: Dissection, options: DissectOptions, depth = 0): T {
  if(Array.isArray(selectors)){
    return iterateArraySelectors(selectors, dissection, options, depth)
  }else{
    return iterateObjectSelectors(selectors, dissection, options, depth)
  }
}

/** Iterate through an object selector. For example, an object selector might look like:
 * {
 *  title: "title",
 *  paragraphs: ["p", {
 *    extract: "text"
 *  }]
 * }
 */
function iterateObjectSelectors<T extends object>(selectors: T, dissection: Dissection, options: DissectOptions, depth: number = 0): T {
  if (depth > options.maxDepth) throw new Error(`Maximum recursion depth of ${options.maxDepth} exceeded`)

  let results = {} as T

  for (const [key, selector] of Object.entries(selectors)) {
    // A key, value pair might be { key: "paragraphs", selector: "p"}
    // or "1": { key: "paragraphs", selector: ["p", { extract: "text" }]}
    if (typeof selector[1] == 'object' && !(Array.isArray(selector[1]))) { // User is providing new, custom options
      const formattedPair = {
        selectors: selector[0],
        options: selector[1]
      }

      if (typeof formattedPair.selectors == "string") { // Or "if they are passing a single selector"
        addToResults(key, dissection.get(selector[0], { ...options, ...formattedPair.options }), results)
      } else if (Array.isArray(formattedPair.selectors)) { // Or "if they are passing multiple selectors"
        processSelectorArray(formattedPair.selectors, key, dissection, { ...options, ...formattedPair.options }, results, depth)
      }
    }
  }

  return results
}

/** Iterate through an array selector. For example, an array selector might look like:
 * ["title", "p", "meta=[property=title]"]
 */
function iterateArraySelectors<T extends string[]>(selectors: T, dissection: Dissection, options: DissectOptions, depth: number = 0): T {
  if (depth > options.maxDepth) throw new Error(`Maximum recursion depth of ${options.maxDepth} exceeded`)

  let results = [] as T

  selectors.forEach((selector: string, i: number) => {
    // A selector might be "title"
    addToResults(i.toString(), dissection.get(selector, options), results)
  })

  return results
}

export { processSelectorArray, iterateSelectors }