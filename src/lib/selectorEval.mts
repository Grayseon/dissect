import { DissectOptions, Results, SelectorPair } from '../types/types.mjs'
import DissectionError from './DissectionError.mjs'
import Dissection from './Dissection.mjs'

function addToResults(
  key: string,
  value: any[],
  results: Results | string[]
): void {
  if (!value) return
  if (Array.isArray(results)) {
    // Selectors will be an array if the user uses multiple selectors in the same selector key. title: ['title', 'meta[type="og:title"']]
    if (Array.isArray(value)) {
      results.push(...value) // Spread to add multiple values in case value is a string[]
    } else {
      results.push(value) // Push single string if value is not an array
    }
  } else {
    results[key] = results[key] ? [...results[key], ...value] : [...value]
  }
}

function processSelectorArray(
  selectors: string[],
  key: string,
  dissection: Dissection,
  options: DissectOptions,
  results: Results,
  depth: number
): void {
  const iterations: any[] = iterateArraySelectors(
    selectors,
    dissection,
    options,
    depth + 1
  )

  // Every output is checked if existant. If it is null it returns []. This might be triggered if there are no selectors or if the filter filters everything out.
  switch (options.arrayType) {
    case 'all': // Every selector is added to results, all in groups of arrays per selector
      addToResults(key, iterations || [], results)
      break
    case 'flatAll': // Every selector is added to results, but they are ungrouped. This is the default arrayType
      addToResults(key, iterations.flat() || [], results)
      break
    case 'priority': // Only the first non-empty selector is added to the results.
      addToResults(
        key,
        iterations.find((item: string | string[]) => item.length > 0) || [],
        results
      )
      break
  }
}

function iterateSelectors(
  selectors: string[],
  dissection: Dissection,
  options: DissectOptions,
  depth?: number
): string[]
function iterateSelectors<T extends Results>(
  selectors: T,
  dissection: Dissection,
  options: DissectOptions,
  depth?: number
): T
function iterateSelectors<T extends object>(
  selectors: T,
  dissection: Dissection,
  options: DissectOptions,
  depth = 0
): T | string[] {
  if (Array.isArray(selectors)) {
    return iterateArraySelectors(selectors, dissection, options, depth)
  } else {
    return iterateObjectSelectors(
      selectors as Results,
      dissection,
      options,
      depth
    ) as T
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
function iterateObjectSelectors<T extends Results>(
  selectors: T,
  dissection: Dissection,
  options: DissectOptions,
  depth: number = 0
): T {
  if (depth > options.maxDepth)
    throw new DissectionError(
      `Maximum recursion depth of ${options.maxDepth} exceeded`
    )

  const results: Results = {}

  for (const [key, selector] of Object.entries(selectors)) {
    // A key, value pair might be { key: "paragraphs", selector: "p"}
    // or "1": { key: "paragraphs", selector: ["p", { extract: "text" }]}
    const formattedPair: SelectorPair = {
      selectors: Array.isArray(selector) ? selector[0] : selector,
      options: selector[1]
    }

    if (typeof selector[1] == 'object' && !Array.isArray(selector[1])) {
      // User is providing new, custom options
      options = { ...options, ...formattedPair.options }
    }

    if (typeof formattedPair.selectors == 'string') {
      // Or "if they are passing a single selector"
      addToResults(
        key,
        dissection.get(formattedPair.selectors, options),
        results
      )
    } else if (Array.isArray(formattedPair.selectors)) {
      // Or "if they are passing multiple selectors"
      processSelectorArray(
        formattedPair.selectors,
        key,
        dissection,
        options,
        results,
        depth
      )
    }
  }

  return results as T
}

/** Iterate through an array selector. For example, an array selector might look like:
 * ["title", "p", "meta=[property=title]"]
 */
function iterateArraySelectors<T extends string[]>(
  selectors: T,
  dissection: Dissection,
  options: DissectOptions,
  depth: number = 0
): T {
  if (depth > options.maxDepth)
    throw new DissectionError(
      `Maximum recursion depth of ${options.maxDepth} exceeded`
    )

  const results: string[] = [] as unknown as T

  selectors.forEach((selector: string, i: number) =>
    addToResults(i.toString(), dissection.get(selector, options), results)
  ) // A selector might be "title"

  return results as T
}

export { processSelectorArray, iterateSelectors }
