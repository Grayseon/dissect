import { ZodError } from "zod"
import dissect from "../index.js"
import * as assert from "assert"
import Dissection from "../lib/Dissection.js"

describe('Invalid inputs', ()=>{
  it('should not allow a blank url', async ()=>{
    try {
      await dissect()
      assert.fail("Expected a ZodError to be thrown because no URL was provided")
    } catch (e) {
      assert.ok(e instanceof ZodError)
    }
  })
  
  it('should not allow an invalid url', async ()=>{
    try {
      await dissect('randomstring')
      assert.fail("Expected a ZodError to be thrown because URL was invalid")
    } catch (e) {
      assert.ok(e instanceof ZodError)
    }
  })
  
  it('should return null when no elements exist for selector', async ()=>{
    assert.deepStrictEqual(await dissect('https://en.wikipedia.org/wiki/Rose', {'broken': 'random nonexistent selector'}), {broken: null})
  })
})

const dissection = await dissect('https://en.wikipedia.org/wiki/Hydropower')

describe('Dissection', ()=>{
  
  it('should return a constructor instead of an object when no selectors are passed', ()=>{
    assert.ok(dissection instanceof Dissection, "Dissection is not the proper constructor. This will likely cause most following tests to fail.")
  })

  it('should return the title of the webpage', ()=>{
    try {
      const result = dissection.get("title")

      assert.deepStrictEqual(result[0], "Hydropower - Wikipedia")
    } catch(e) {
      assert.fail(e)
    }
  })

  it('should support attributes', ()=>{
    const result = dissection.get('meta[property="og:title"]', {
      extract: "attr",
      attr: "content"
    })
    
    assert.strictEqual(result[0], "Hydropower - Wikipedia")
  })
  
  it('should support html extraction', ()=>{
    const result = dissection.get('.mw-heading a[title]', {
      extract: "html"
    })
    
    assert.strictEqual(result[0], '<span>edit</span>')
  })

  it('should support element extraction', ()=>{
    const result = dissection.get('.mw-page-title-main', {
      extract: "element"
    })
    
    assert.strictEqual(result[0].text(), "Hydropower")
  })
})