# Dissect
_ _ _
Turn this
```javascript
import * as cheerio from "cheerio"

const response = await fetch('https://en.wikipedia.org/wiki/Linus_Torvalds')
const $ = cheerio.load(await response.text())

$('meta[property="og:image"]').map((_, el)=>{
    return el.attribs['content'].trim() || null
})
.get()
```
into this
```javascript
import dissect from "dissect"

await dissect('https://en.wikipedia.org/wiki/Linus_Torvalds', {
    coverImage: 'meta[property="og:image"]'
}, {
    extract: "attr",
    attr: "content"
})
```
**Let Dissect do the work for you**