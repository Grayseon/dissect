// THIS IS NOT AN EXAMPLE OF DISSECT. THIS IS AN EXAMPLE USING CHEERIO.

import * as cheerio from "cheerio"

const response = await fetch('https://en.wikipedia.org/wiki/Linus_Torvalds')
const $ = cheerio.load(await response.text())

$('meta[property="og:image"]').map((_, el)=>{
    return el.attribs['content'].trim() || null
})
.get()