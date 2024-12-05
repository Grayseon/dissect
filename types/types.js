/**
 * @module Types
 */

/**
 * Typedef for dissect options
 * @typedef {Object} DissectOptions
 * @property {('text'|'html'|'attr'|'element')} [extract='text'] The type of extraction: `text`, `html`, or `attr`. Default is `text`.
 * @property {string} [attr] The attribute to extract. Required if `extract` is `attr`.
 * @property {Function} [filter] Filter function to add post-processing to the results.
 */