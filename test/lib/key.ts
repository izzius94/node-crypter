import assert from 'assert'
import { generate, read } from '../../src/lib/key'

describe('Key module', () => {
  describe('# Generation', () => {
    it('Should create an encryption key string of 44 characters', () => {
      const key = generate()

      assert.strictEqual(key.length, 44)
    })
    it('Should create different keys every time', () => {
      assert.notEqual(generate(), generate)
    })
  })
  describe('# Reading', () => {
    it('Could read an encryption key created by a laravel project', () => {
      const key = read('1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw=')

      assert.strictEqual(key.length, 32)
    })
  })
})
