import { expect } from 'chai'
import { decrypt, encrypt } from '../../src/lib/crypt'
import { encryptedInvalidPayload } from '../config'
import forEach from 'mocha-each'
import { algorithm, read } from '../../src/lib/key'
import assert from 'assert'

describe('crypt', () => {
  forEach([
    ['aes-256-cbc', '1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw=', 'eyJpdiI6IlRWaDZIZCtiNHJQMFJTNnhtOEJ4dkE9PSIsInZhbHVlIjoiYVlGL0RFWHhBR0N5Z011RjU0T2gwQT09IiwibWFjIjoiYzM1NWY0MjE2NDc0ZWM4ZjExNDRmYzRiYWFhOWZkYmJhY2VkNDEyZWY5NTc0Yjg0N2VjNTZhNTlmNGMwZTZhNiIsInRhZyI6IiJ9', '8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U=='],
    ['aes-128-cbc', 'OT8by/782/nqNUwrm4TbLg==', 'eyJpdiI6IkZRZVVZYmRsNDJDQkJpQ2hqZXEwSkE9PSIsInZhbHVlIjoiQWhZT0dBVi9vWC8xTndHMGJaZ3YxUT09IiwibWFjIjoiYzY5Y2Y4YmY2ODNjMThmOTU3NTBkNDkyNzNkNGZmYjhlZDNlMzk2MTAzZjEyMDEwNDBjODYxYjMyYTRlY2E5YyIsInRhZyI6IiJ9', 'bWfLYaiK0PHaJtyp3NnXfg=='],
    ['aes-256-gcm', 'sCzNv3C9UhFcplY+4neT+ALCQLq+IQwkbCYAnxIFAHQ=', 'eyJpdiI6IkV5NTRIOGdaek1ZS2hsRXMiLCJ2YWx1ZSI6ImZDMThqa1RyS1dkS0lGTT0iLCJtYWMiOiIiLCJ0YWciOiJ0U1FLUnNCaHQwTUJaUDVsK0RhYnJnPT0ifQ==', 'puQm02xCG7krF8zfr0vb6sgFzfYd1w3zrdjGXVpQTV8='],
    ['aes-128-gcm', 'bWfLYaiK0PHaJtyp3NnXfg==', 'eyJpdiI6IjM3TTd2VXNDMFBmNjB3eGsiLCJ2YWx1ZSI6IlB1ZGhTbFE1bzBVc005VT0iLCJtYWMiOiIiLCJ0YWciOiJCMlkxd2NmMDZSZmcrV3ZyWVlRQnlBPT0ifQ==', 'ZBq7Bx+oG0GVd8ixu4Y+mQ==']
  ]).describe('Using %s', (algo: algorithm, key: string, encrypted: string, otherKey: string) => {
    describe('# decrypt', () => {
      it('Should rise an exception if the payload is invalid', () => {
        expect(() => decrypt(encryptedInvalidPayload, read(key), algo), algo).Throw('Invalid payload.')
      })
      it('Should rise an exception if the MAC is invalid', () => {
        if (algo === 'aes-128-cbc' || algo === 'aes-256-cbc') {
          return expect(() => decrypt(encrypted, read(otherKey), algo), algo).Throw('Invalid MAC.')
        }

        return expect(() => decrypt(encrypted, read(otherKey), algo), algo).Throw('Unsupported state or unable to authenticate data')
      })
      it('Should decrypt a string', () => {
        expect('test-string').equal(decrypt(encrypted, read(key), algo))
      })
    })
    describe('# encrypt', () => {
      it('Checking the payload of encrypted data', () => {
        const encrypted = encrypt('test-string', read(key), algo)

        assert(Buffer.from(encrypted, 'base64').toString('base64') === encrypted, 'The payload must be encoded in base64')

        const decoded = JSON.parse(Buffer.from(encrypted, 'base64').toString())

        assert(Buffer.from(decoded.iv, 'base64').toString('base64') === decoded.iv, 'The IV in the payload must be encoded in base64')
        assert(Buffer.from(decoded.value, 'base64').toString('base64') === decoded.value, 'The value in the payload must be encoded in base64')

        if (algo === 'aes-128-cbc' || algo === 'aes-256-cbc') {
          assert(decoded.mac !== '', `Mac could not be empty with algorithm ${algo}`)
          assert(decoded.tag === '', `Tag should be empty with algorithm ${algo}`)
          return
        }

        assert(decoded.mac === '', `Mac should be empty with algorithm ${algo}`)
        assert(decoded.tag !== '', `Tag could not be empty with algorithm ${algo}`)
        assert(Buffer.from(decoded.tag, 'base64').toString('base64') === decoded.tag)
      })
      it('Should encrypt a string correctly', () => {
        const original = 'test-string'
        const encrypted = encrypt(original, read(key), algo)
        const decrypted = decrypt(encrypted, read(key), algo)

        expect(decrypted).equal(original)
      })
    })
  })
})
