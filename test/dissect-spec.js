import { dissect } from "../index.js"
import * as assert from "assert"

describe('Dissect basics', ()=>{
  it('should not allow a blank url', async ()=>{
    try {
      await dissect()
      assert.fail('Expected an error for missing URL, but none was thrown')
    } catch (e) {
      assert.strictEqual(e.message, 'No URL provided', 'Unexpected error message')
    }
  })

  it('should not allow empty selectors', async ()=>{
    try {
      await dissect('https://en.wikipedia.org/wiki/Hydropower')
      assert.fail('Expected an error for missing selectors, but none was thrown')
    } catch (e) {
      assert.strictEqual(e.message, 'No selectors provided', 'Unexpected error message')
    }
  })

  it('should return the title of the webpage', async ()=>{
    try {
      const result = await dissect('https://en.wikipedia.org/wiki/Hydropower', {
        title: "title"
      })

      assert.strictEqual(result.title, "Hydropower - Wikipedia")
    } catch(e) {
      assert.fail(e)
    }
  })
})