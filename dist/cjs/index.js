"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validators_mjs_1 = require("./lib/validators.mjs");
const selectorEval_mjs_1 = require("./lib/selectorEval.mjs");
const Dissection_mjs_1 = __importDefault(require("./lib/Dissection.mjs"));
const DissectionError_mjs_1 = __importDefault(require("./lib/DissectionError.mjs"));
const ky_1 = __importDefault(require("ky"));
const cheerio = __importStar(require("cheerio"));
/**
 * Dissects a webpage
 * @param {string} url URL to dissect
 * @param {object} [selectors] CSS selectors to grab
 * @param {DissectOptions} options Additional dissection options
 * @returns {object|Dissection} Results of the search. If no selectors are initially provided, it will return a Dissection constructor.
 * @throws {Error} Errors may be thrown due to network errors or invalid inputs
 */
async function dissect(url, selectors, options) {
    validators_mjs_1.urlSchema.parse(url);
    if (selectors)
        validators_mjs_1.selectorSchema.parse(selectors);
    const validatedOptions = validators_mjs_1.optionsSchema.parse(options || {});
    let response;
    let $;
    try {
        response = await (0, ky_1.default)(url).text();
        $ = cheerio.load(response);
    }
    catch (e) {
        throw new DissectionError_mjs_1.default(`Error while processing URL: ${e}`);
    }
    const dissection = new Dissection_mjs_1.default($, validatedOptions);
    if (selectors) {
        return (0, selectorEval_mjs_1.iterateSelectors)(selectors, dissection, validatedOptions);
    }
    else {
        return dissection;
    }
}
exports.default = dissect;
//# sourceMappingURL=index.js.map