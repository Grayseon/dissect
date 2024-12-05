import dissect from "../index.js"

const data = await dissect('https://en.wikipedia.org/wiki/Linus_Torvalds', {
    coverImage: 'meta[property="og:image"]',
    pageTitle: 'meta[property="og:title"]',
    paragraphs: ['p', {
        extract: "text"
    }]
}, {
    extract: "attr",
    attr: "content"
})

console.log(data)