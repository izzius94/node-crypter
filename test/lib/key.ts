import assert from 'assert'
import { generate, read, algo } from '../../src/lib/key'

const keys: {algo: algo, size: number, key: string, length: number}[] = [{
  algo: 'aes-256-cbc',
  size: 44,
  key: '1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw=',
  length: 32
}, {
  algo: 'aes-128-cbc',
  size: 24,
  key: 'OT8by/782/nqNUwrm4TbLg==',
  length: 16
}] 

keys.forEach(element => {
  describe(`Key module with algo ${element.algo}`, () => {
    describe('# Generation', () => {
      it(`Should create an encryption key string of ${element.size} characters`, () => {
        const key = generate(element.algo)

        assert.strictEqual(key.length, element.size)
      })
      it('Should create different keys every time', () => {
        assert.notEqual(generate(), generate())
      })
    })
    describe('# Reading', () => {
      it('Could read an encryption key created by a laravel project', () => {
        const key = read(element.key)

        assert.strictEqual(key.length, element.length)
      })
    })
  })
})
