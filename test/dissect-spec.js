import { ZodError } from "zod"
import dissect from "../index.js"
import * as assert from "assert"
import Dissection from "../lib/Dissection.js"

import { readFileSync } from "fs"
import { createServer } from "http"

const server = createServer((_,res)=>{ // This server will be sent requests for testing
  res.writeHead(200, { 'content-type': 'text/html' })
  res.end(readFileSync('./test/site.html', 'utf-8'))
})

server.listen(8083)

const url = 'http://localhost:8083'

describe('Invalid inputs', () => {
  it('should not allow a blank url', async () => {
    try {
      await dissect()
      assert.fail("Expected a ZodError to be thrown because no URL was provided")
    } catch (e) {
      assert.ok(e instanceof ZodError)
    }
  })

  it('should not allow an invalid url', async () => {
    try {
      await dissect('randomstring')
      assert.fail("Expected a ZodError to be thrown because URL was invalid")
    } catch (e) {
      assert.ok(e instanceof ZodError)
    }
  })

  it('should return an empty array when no elements exist for selector', async () => {
    assert.deepStrictEqual(await dissect(url, { 'broken': 'random nonexistent selector' }), { broken: [] })
  })

  it('should not allow a false tuple', async () => {
    try {
      await dissect(url, {
        title: ["title", 3]
      })
      assert.fail('Expected a ZodError because the custom tuple was false')
    } catch (e) {
      assert.ok(e instanceof ZodError)
    }
  })
})

const dissection = await dissect(url)

describe('Dissection', () => {

  it('should return a constructor instead of an object when no selectors are passed', () => {
    assert.ok(dissection instanceof Dissection, "Dissection is not the proper constructor. This will likely cause most following tests to fail.")
  })

  it('should return the title of the webpage', () => {
    try {
      const result = dissection.get("title")

      assert.deepStrictEqual(result[0], "Dissect")
    } catch (e) {
      assert.fail(e)
    }
  })

  it('should support attributes', () => {
    const result = dissection.get('meta[property="og:title"]', {
      extract: "attr",
      attr: "content"
    })

    assert.strictEqual(result[0], "Dissect testing page")
  })

  it('should support html extraction', () => {
    const result = dissection.get('#friendly-div', {
      extract: "html"
    })

    assert.strictEqual(result[0], '<span>Hi!</span>')
  })

  it('should support element extraction', () => {
    const result = dissection.get('#friendly-div', {
      extract: "element"
    })

    assert.strictEqual(result[0].text().trim(), "Hi!")
  })

  it('should support any scenarios', async () => {
    const results = await dissect(url, {
      title: "title", // Text extract
      links: "a", // Also text extract
      coverImage: ['meta[property="og:image"]', {
        extract: "attr",
        attr: "content"
      }],
      notes: ["#friendly-div", {
        extract: "html"
      }],
      title2: ["h1", {
        extract: "element"
      }],
      paragraphs: ["p", {
        extract: "text",
        filter: function (data) {
          return data !== ''
        },
        map: function (data) {
          return data.replace(/e/g, '') // Removes every 'e'
        },
        postProcessing: function (data) {
          return data.reverse()
        }
      }],
      paragraphsWithoutFilters: "p"
    })

    const titleWorks = results.title[0] == "Dissect"
    const linksWork = results.links[0] == "Go to ebay.com"
    const notesWork = results.notes[0] == '<span>Hi!</span>'
    const coverImageWorks = results.coverImage[0] == 'https://avatars.githubusercontent.com/u/9950313?s=48&v=4'
    const imagesWork = results.title2[0].text() == "Dissect"
    const filterWorks = results.paragraphs.indexOf('') == -1
    const mapWorks = results.paragraphs[1].indexOf('e') == -1
    const postProcessingWorks = results.paragraphs[2] == "This is paragraph 2"

    assert.ok(titleWorks, `Title did not work ${results.title[0]}`)
    assert.ok(linksWork, `Links did not work ${results.links[0]}`)
    assert.ok(notesWork, `Notes did not work ${results.notes[0]}`)
    assert.ok(coverImageWorks, `Cover image did not work ${results.coverImage[0]}`)
    assert.ok(imagesWork, `Images did not work ${results.title2[0].text()}`)
    assert.ok(results.paragraphs.length > 1, 'Paragraphs is an empty array')
    assert.ok(filterWorks, 'Filter did not work')
    assert.ok(mapWorks, 'Map did not work')
    assert.ok(postProcessingWorks, `Post-processing does not work`)
  })

  it('should support function options when they are not granular', async () => {
    const results = await dissect(url, {
      paragraphs: 'p'
    }, {
      filter: function (data) {
        return data !== ''
      },
      map: function (data) {
        return data.replace(/e/g, '') // Removes every 'e'
      },
      postProcessing: function (data) {
        return data.reverse()
      }
    })

    server.close()

    const filterWorks = results.paragraphs.indexOf('') == -1
    const mapWorks = results.paragraphs[1].indexOf('e') == -1
    const postProcessingWorks = results.paragraphs[2] == "This is paragraph 2"

    assert.ok(filterWorks, 'Filter did not work')
    assert.ok(mapWorks, 'Map did not work')
    assert.ok(postProcessingWorks, 'Post-processing does not work')

  })
})