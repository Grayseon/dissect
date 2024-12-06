import dissect from "../index.js"

const data = await dissect('https://en.wikipedia.org/wiki/Linus_Torvalds', {
  coverImage: 'meta[property="og:image"]',
  pageTitle: 'meta[property="og:title"]',
  paragraphs: ['p', {
    extract: "text",
    map: (data) => {
      return data.replace(/[0-9]/g, '')
    }
  }]
}, {
  extract: "attr",
  attr: "content"
})

console.log(data)