// FIXME: check options.arrayType = 'flatAll'

function addToResults(key, value, results) {
  if (!value) return results
  if (results instanceof Array) { // Selectors will be an array if the user uses multiple selectors in the same selector key. title: ['title', 'meta[type="og:title"']]
    results.push(value)
  } else {
    results[key] = value
  }

  return results
}

function handleSelectorArray(selector, key, dissection, options, results, depth) {
  switch (options.arrayType) {
    case 'all': // Every selector is added to results, all in groups of arrays per selector
      results = addToResults(key, iterateSelectors(selector, dissection, options, depth + 1), results)
      break
    case 'flatAll': // Every selector is added to results, but they are ungrouped. This is the default arrayType
      iterateSelectors(selector, dissection, options, depth + 1).forEach(res => {
        results = addToResults(key, res, { ...results })
      })
      break
    case 'priority': // Only the first non-empty selector is added to the results.
      const resultOfIteration = iterateSelectors(selector, dissection, options, depth + 1)
      const firstIndex = resultOfIteration.findIndex(data => (data.length > 0))

      results = addToResults(key, firstIndex == -1 ? undefined : resultOfIteration[firstIndex], results)
      break
  }

  return results
}

function iterateSelectors(selectors, dissection, options, depth = 0) {
  if (depth > options.maxDepth) throw new Error('Maximum recursion depth exceeded')

  let results = selectors instanceof Array ? [] : {} // If they provided multiple selectors as an array it will be an array of results, but if they provided an object of selectors they will get an object result

  for (const [key, selector] of Object.entries(selectors)) {
    if (selector instanceof Array) { // Selector will be an array if the user provides multiple selectors or if the user wants to change the options
      if (typeof selector[1] == 'object' && !Array.isArray(selector[1])) { // User is providing one selector and changing the options
        results = addToResults(key, dissection.get(selector[0], { ...options, ...selector[1] }), results) // [0] is selector as a string, [1] is options
      } else if (Array.isArray(selector[1])) { // User is providing multiple selectors
        results = handleSelectorArray(selector, key, dissection, options, { ...results }, depth)
      } else {
        throw new Error(`Unexpected second index of selector. Expected an object or array, got ${selector[1]}`)
      }
    } else {
      results = addToResults(key, dissection.get(selector), results)
    }
  }

  return results
}

export { handleSelectorArray, iterateSelectors }