// THIS IS NOT AN EXAMPLE OF DISSECT. THIS IS AN EXAMPLE USING CHEERIO.

import * as cheerio from "cheerio"

const response = await fetch('https://en.wikipedia.org/wiki/Linus_Torvalds')
const $ = cheerio.load(await response.text())

const coverImage = $('meta[property="og:image"]').map((_, el) => {
  return el.attribs['content'].trim() || null
}).get()

const pageTitle = $('meta[property="og:title"]').map((_, el) => {
  return el.attribs['content'].trim() || null
}).get()

const paragraphs = $('p').map((_, el) => {
  return $(el).text()
}).map((_, data) => {
  console.log(data)
  return data.replace(/\n|\[[0-9]+\]/g, '') //Remove footnotes and newlines
}).get().filter((data) => {
  return data.toString() !== ''
})

const data = {
  coverImage,
  pageTitle,
  paragraphs
}

console.log(data)