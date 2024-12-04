import dissect from "../index.js"

await dissect('https://en.wikipedia.org/wiki/Linus_Torvalds', {
    coverImage: 'meta[property="og:image"]'
}, {
    extract: "attr",
    attr: "content"
})