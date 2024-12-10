import Dissection from "./Dissection"

function addToResults(key: string, value: string | Array<>, results: object): object {
  if (!value) return results
  if (Array.isArray(results)) { // Selectors will be an array if the user uses multiple selectors in the same selector key. title: ['title', 'meta[type="og:title"']]
    results.push(value)
  } else {
    results[key] = results[key] ? [...results[key], ...value] : [...value]
  }
  return results
}

function processSelectorArray(selector: any[], key: string, dissection: any, options: DissectOptions, results: object, depth: number) {
  const iterations = iterateSelectors(selector, dissection, options, depth + 1)

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

function iterateSelectors(selectors, dissection: Dissection, options: { map: (...args: unknown[]) => unknown; filter: (...args: unknown[]) => unknown; arrayType: "all" | "flatAll" | "priority"; extract: "text" | "html" | "attr" | "element"; maxDeth: number; postProcessing: (...args: unknown[]) => unknown; attr?: string | undefined }, depth = 0) {
  if (depth > options.maxDepth) throw new Error(`Maximum recursion depth of ${options.maxDepth} exceeded`)

  let results = Array.isArray(selectors) ? [] : {} // If they provided multiple selectors as an array it will be an array of results, but if they provided an object of selectors they will get an object result

  for (const [key, selector] of Object.entries(selectors)) {
    if (Array.isArray(selector)) { // Selector will be an array if the user provides multiple selectors or if the user wants to change the options
      if (typeof selector[1] == 'object' && !(Array.isArray(selector[1]))) { // User is providing one selector or an array of selectors and changing the options [selectors, options]
        if(Array.isArray(selector[0])){
          processSelectorArray(selector[0], key, dissection, { ...options, ...selector[1] }, results, depth)
        } else {
          addToResults(key, dissection.get(selector[0], { ...options, ...selector[1] }), results) // [0] is selector as a string, [1] is options
        }
      } else if (typeof selector[1] == "string") {
        processSelectorArray(selector, key, dissection, options, results, depth)
      } else {
        throw new Error(`Unexpected second index of selector. Expected an object or array, got ${selector[1]}`)
      }
    } else {
      addToResults(key, dissection.get(selector, options), results)
    }
  }

  return results
}

export { processSelectorArray, iterateSelectors }