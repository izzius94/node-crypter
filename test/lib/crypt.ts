import { expect } from 'chai'
import { decrypt, encrypt } from '../../src/lib/crypt'
import { key, encrypted, encryptedInvalidPayload, anotherKey } from '../config'
import forEach from 'mocha-each'
import { algo, read } from '../../src/lib/key'


describe('crypt', () => {
  forEach([
    ['aes-256-cbc', '1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw=', 'eyJpdiI6IlRWaDZIZCtiNHJQMFJTNnhtOEJ4dkE9PSIsInZhbHVlIjoiYVlGL0RFWHhBR0N5Z011RjU0T2gwQT09IiwibWFjIjoiYzM1NWY0MjE2NDc0ZWM4ZjExNDRmYzRiYWFhOWZkYmJhY2VkNDEyZWY5NTc0Yjg0N2VjNTZhNTlmNGMwZTZhNiIsInRhZyI6IiJ9'],
    ['aes-128-cbc', 'OT8by/782/nqNUwrm4TbLg==', 'eyJpdiI6IkZRZVVZYmRsNDJDQkJpQ2hqZXEwSkE9PSIsInZhbHVlIjoiQWhZT0dBVi9vWC8xTndHMGJaZ3YxUT09IiwibWFjIjoiYzY5Y2Y4YmY2ODNjMThmOTU3NTBkNDkyNzNkNGZmYjhlZDNlMzk2MTAzZjEyMDEwNDBjODYxYjMyYTRlY2E5YyIsInRhZyI6IiJ9']
  ]).describe('Using %s', (algo: algo, key: string, encrypted: string) => {
    describe('# decrypt', () => {
      it('Should rise an exception if the payload is invalid', () => {
        expect(() => decrypt(encryptedInvalidPayload, read(key)), algo).Throw('Invalid payload.')
      })
      it('Should rise an exception if the MAC is invalid', () => {
        expect(() => decrypt(encrypted, anotherKey), algo).Throw('Invalid MAC.')
      })
      it('Should decrypt a string', () => {
        console.log(key, algo)
        expect('test-string').equal(decrypt(encrypted, read(key), algo))
      })
    })
    describe('# encrypt', () => {
      it('Should encrypt a string correctly', () => {
        const original = 'test-string'
        const encrypted = encrypt(original, read(key), algo)
        const decrypted = decrypt(encrypted, read(key), algo)
  
        expect(decrypted).equal(original)
      })
    })
  })
})
