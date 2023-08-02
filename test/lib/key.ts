import assert from 'assert'
import { generate, read, algo } from '../../src/lib/key'
import forEach from 'mocha-each'

describe('Key module', () => {
  forEach([
    ['aes-256-cbc', 44, 32, '1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw='],
    ['aes-128-cbc', 24, 16, 'OT8by/782/nqNUwrm4TbLg=='],
    ['aes-256-gcm', 44, 32, 'sCzNv3C9UhFcplY+4neT+ALCQLq+IQwkbCYAnxIFAHQ=']

  ]).describe('# Algo %s', (algo: algo, size: number, length: number, key: string) => {
    it(`Should create an encryption key string of ${size} characters`, () => {
      assert.strictEqual(generate(algo).length, size)
    })
    it('Could read an encryption key created by a laravel project', () => {
      assert.strictEqual(read(key).length, length)
    })
  })
})
