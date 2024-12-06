/**
 * @module Types
 */

/**
 * Typedef for dissect options
 * @typedef {Object} DissectOptions
 * @property {('text'|'html'|'attr'|'element')} [extract='text'] The type of extraction: `text`, `html`, or `attr`. Default is `text`.
 * @property {string} [attr] The attribute to extract. Required if `extract` is `attr`.
 * @property {Function} [filter] Filter function takes in your function to filter the output. Used as the regular Array.prototype.filter()
 * @property {Function} [map] Map function takes in your function to map the output array. Used as the regular Array.prototype.map()
 * @property {Function} [postProcessing] Post-processing function can process the output array any way you would like. Function runs after filter and map.
 * @property {Function} [granularPostProcessing] Granular post-processing function adds post-processing to each individual index of an output.
 */