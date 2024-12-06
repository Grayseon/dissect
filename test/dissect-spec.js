import { ZodError } from "zod"
import dissect from "../index.js"
import * as assert from "assert"
import Dissection from "../lib/Dissection.js"

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

  it('should return null when no elements exist for selector', async () => {
    assert.deepStrictEqual(await dissect('https://en.wikipedia.org/wiki/Rose', { 'broken': 'random nonexistent selector' }), { broken: null })
  })

  it('should not allow a false tuple', async () => {
    try {
      await dissect('https://en.wikipedia.org/wiki/Hydropower', {
        title: ["title", 3]
      })
      assert.fail('Expected a ZodError because the custom tuple was false')
    } catch (e) {
      assert.ok(e instanceof ZodError)
    }
  })
})

const dissection = await dissect('https://en.wikipedia.org/wiki/Hydropower')

describe('Dissection', () => {

  it('should return a constructor instead of an object when no selectors are passed', () => {
    assert.ok(dissection instanceof Dissection, "Dissection is not the proper constructor. This will likely cause most following tests to fail.")
  })

  it('should return the title of the webpage', () => {
    try {
      const result = dissection.get("title")

      assert.deepStrictEqual(result[0], "Hydropower - Wikipedia")
    } catch (e) {
      assert.fail(e)
    }
  })

  it('should support attributes', () => {
    const result = dissection.get('meta[property="og:title"]', {
      extract: "attr",
      attr: "content"
    })

    assert.strictEqual(result[0], "Hydropower - Wikipedia")
  })

  it('should support html extraction', () => {
    const result = dissection.get('.mw-heading a[title]', {
      extract: "html"
    })

    assert.strictEqual(result[0], '<span>edit</span>')
  })

  it('should support element extraction', () => {
    const result = dissection.get('.mw-page-title-main', {
      extract: "element"
    })

    assert.strictEqual(result[0].text(), "Hydropower")
  })

  it('should support any scenarios', async () => {
    const results = await dissect('https://en.wikipedia.org/wiki/Hydropower', {
      title: "title", // Text extract
      links: "a", // Also text extract
      notes: ["*[role=note]", {
        extract: "html"
      }],
      title2: [".mw-page-title-main", {
        extract: "element"
      }],
      paragraphs: ["p", {
        extract: "text",
        filter: function (data) {
          return data !== ''
        },
        map: function(data){
          return data.replace(/e/g, '') // Removes every 'e'
        },
        postProcessing: function (data){
          data.pop()
          return data
        }
      }],
      paragraphsWithoutFilters: "p"
    })

    const titleWorks = results.title[0] == "Hydropower - Wikipedia"
    const linksWork = results.links[0] == "Jump to content"
    const notesWork = results.notes[0] == 'This article is about the general concept of hydropower. For the use of hydropower for electricity generation, see <a href="/wiki/Hydroelectricity" title="Hydroelectricity">hydroelectricity</a>.'
    const imagesWork = results.title2[0].text() == "Hydropower"
    const filterWorks = results.paragraphs[0] !== ''

    assert.ok(titleWorks, 'Title did not work')
    assert.ok(linksWork, 'Links did not work')
    assert.ok(notesWork, 'Notes did not work')
    assert.ok(imagesWork, 'Images did not work')
    assert.ok(results.paragraphs.length > 1, 'Paragraphs is an empty array')
    assert.ok(results.paragraphsWithoutFilters[0] == '', 'Unable to check filter, webpage might have changed.')
    assert.ok(filterWorks, 'Filter did not work')
  })
})