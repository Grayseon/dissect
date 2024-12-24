import DissectionError from './DissectionError.mjs';
function addToResults(key, value, results) {
    if (!value)
        return;
    if (Array.isArray(results)) {
        // Selectors will be an array if the user uses multiple selectors in the same selector key. title: ['title', 'meta[type="og:title"']]
        if (Array.isArray(value)) {
            results.push(...value); // Spread to add multiple values in case value is a string[]
        }
        else {
            results.push(value); // Push single string if value is not an array
        }
    }
    else {
        results[key] = results[key] ? [...results[key], ...value] : [...value];
    }
}
function processSelectorArray(selectors, key, dissection, options, results, depth) {
    const iterations = iterateArraySelectors(selectors, dissection, options, depth + 1);
    // Every output is checked if existant. If it is null it returns []. This might be triggered if there are no selectors or if the filter filters everything out.
    switch (options.arrayType) {
        case 'all': // Every selector is added to results, all in groups of arrays per selector
            addToResults(key, iterations || [], results);
            break;
        case 'flatAll': // Every selector is added to results, but they are ungrouped. This is the default arrayType
            addToResults(key, iterations.flat() || [], results);
            break;
        case 'priority': // Only the first non-empty selector is added to the results.
            addToResults(key, iterations.find((item) => item.length > 0) || [], results);
            break;
    }
}
function iterateSelectors(selectors, dissection, options, depth = 0) {
    if (Array.isArray(selectors)) {
        return iterateArraySelectors(selectors, dissection, options, depth);
    }
    else {
        return iterateObjectSelectors(selectors, dissection, options, depth);
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
function iterateObjectSelectors(selectors, dissection, options, depth = 0) {
    if (depth > options.maxDepth)
        throw new DissectionError(`Maximum recursion depth of ${options.maxDepth} exceeded`);
    const results = {};
    for (const [key, selector] of Object.entries(selectors)) {
        // A key, value pair might be { key: "paragraphs", selector: "p"}
        // or "1": { key: "paragraphs", selector: ["p", { extract: "text" }]}
        const formattedPair = {
            selectors: Array.isArray(selector) ? selector[0] : selector,
            options: selector[1]
        };
        if (typeof selector[1] == 'object' && !Array.isArray(selector[1])) {
            // User is providing new, custom options
            options = { ...options, ...formattedPair.options };
        }
        if (typeof formattedPair.selectors == 'string') {
            // Or "if they are passing a single selector"
            addToResults(key, dissection.get(formattedPair.selectors, options), results);
        }
        else if (Array.isArray(formattedPair.selectors)) {
            // Or "if they are passing multiple selectors"
            processSelectorArray(formattedPair.selectors, key, dissection, options, results, depth);
        }
    }
    return results;
}
/** Iterate through an array selector. For example, an array selector might look like:
 * ["title", "p", "meta=[property=title]"]
 */
function iterateArraySelectors(selectors, dissection, options, depth = 0) {
    if (depth > options.maxDepth)
        throw new DissectionError(`Maximum recursion depth of ${options.maxDepth} exceeded`);
    const results = [];
    selectors.forEach((selector, i) => addToResults(i.toString(), dissection.get(selector, options), results)); // A selector might be "title"
    return results;
}
export { processSelectorArray, iterateSelectors };
//# sourceMappingURL=selectorEval.mjs.map