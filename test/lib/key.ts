import assert from 'assert'
import { generate } from '../../src/lib/key'

describe('Key module', () => {
  describe('# Generation', () => {
    it('Should create an application key string of 44 characters', () => {
      const key = generate()
      assert.strictEqual(typeof key, 'string')
      assert.strictEqual(key.length, 44)
    })
  
    it('Could create an application key as a Buffer', () => {
      const key = generate(false)
      assert.strictEqual(key instanceof Buffer, true)
    })
  })
})
