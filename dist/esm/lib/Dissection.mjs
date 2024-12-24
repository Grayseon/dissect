import { optionsSchema } from './validators.mjs';
function processAllOptions($, elements, options) {
    return options.postProcessing(elements.map((_, el) => {
        const element = $(el);
        if (options.extract == 'text')
            return element.text()?.trim();
        if (options.extract == 'html')
            return element.html()?.trim();
        if (options.extract == 'element')
            return element;
        if (options.extract == 'attr' && options.attr)
            return element.attr(options.attr)?.trim() || null;
        return [];
    })
        .get()
        .filter(options.filter)
        .map(options.map));
}
/** Dissection for a page. Allows you to get data from a page after-the-fact */
class Dissection {
    $;
    options;
    /**
     *
     * @param {CheerioAPI} $
     * @param {DissectOptions} options Additional dissection options
     */
    constructor($, options) {
        this.$ = $;
        this.options = options;
    }
    /**
     *
     * @param {string} selector CSS selector to grab
     * @param {DissectOptions} [options] Additional dissection options. Only use if you want to override the initial constructor options
     */
    get(selector, options = this.options) {
        const elements = this.$(selector);
        let returnValue = [];
        options = optionsSchema.parse(options);
        if (!elements.length) {
            return [];
        }
        if (options.extract == "element") {
            returnValue = processAllOptions(this.$, elements, options);
        }
        else {
            returnValue = processAllOptions(this.$, elements, options);
        }
        return returnValue;
    }
}
export default Dissection;
//# sourceMappingURL=Dissection.mjs.map