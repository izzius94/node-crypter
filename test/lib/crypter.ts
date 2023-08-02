import Crypter from '../../src/lib/crypter'
import { randomBytes } from 'crypto'
import { expect } from 'chai'
import { encryptedInvalidPayload } from '../config'
import { algo, read } from '../../src/lib/key'
import forEach from 'mocha-each'

describe('Crypter', () => {
  forEach([
    ['aes-256-cbc', '1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw=', 'eyJpdiI6IlRWaDZIZCtiNHJQMFJTNnhtOEJ4dkE9PSIsInZhbHVlIjoiYVlGL0RFWHhBR0N5Z011RjU0T2gwQT09IiwibWFjIjoiYzM1NWY0MjE2NDc0ZWM4ZjExNDRmYzRiYWFhOWZkYmJhY2VkNDEyZWY5NTc0Yjg0N2VjNTZhNTlmNGMwZTZhNiIsInRhZyI6IiJ9', read('8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U==')],
    ['aes-128-cbc', 'OT8by/782/nqNUwrm4TbLg==', 'eyJpdiI6IkZRZVVZYmRsNDJDQkJpQ2hqZXEwSkE9PSIsInZhbHVlIjoiQWhZT0dBVi9vWC8xTndHMGJaZ3YxUT09IiwibWFjIjoiYzY5Y2Y4YmY2ODNjMThmOTU3NTBkNDkyNzNkNGZmYjhlZDNlMzk2MTAzZjEyMDEwNDBjODYxYjMyYTRlY2E5YyIsInRhZyI6IiJ9', read('bWfLYaiK0PHaJtyp3NnXfg==')],
    ['aes-256-gcm', 'sCzNv3C9UhFcplY+4neT+ALCQLq+IQwkbCYAnxIFAHQ=', 'eyJpdiI6IkV5NTRIOGdaek1ZS2hsRXMiLCJ2YWx1ZSI6ImZDMThqa1RyS1dkS0lGTT0iLCJtYWMiOiIiLCJ0YWciOiJ0U1FLUnNCaHQwTUJaUDVsK0RhYnJnPT0ifQ==', read('8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U==')],
    ['aes-128-gcm', 'bWfLYaiK0PHaJtyp3NnXfg==', 'eyJpdiI6IjM3TTd2VXNDMFBmNjB3eGsiLCJ2YWx1ZSI6IlB1ZGhTbFE1bzBVc005VT0iLCJtYWMiOiIiLCJ0YWciOiJCMlkxd2NmMDZSZmcrV3ZyWVlRQnlBPT0ifQ==', read('ZBq7Bx+oG0GVd8ixu4Y+mQ==')]
  ]).describe('Using %s', (algo: algo, key: string, encrypted: string, otherKey: Buffer) => {
    describe('# Initialization', () => {
      it('Should rise an exception if an invalid encryption key is provided', () => {
        expect(() => new Crypter(Buffer.from(randomBytes(1)))).Throw('Invalid key lenght.')
      })
      it('Should work will all key types', () => {
        expect(new Crypter(read(key), algo) instanceof Crypter).equal(true)
      })
    })

    const crypter = new Crypter(read(key), algo)

    describe('# Decrypt', () => {
      it('Should decrypt a string', () => {
        expect('test-string').equal(crypter.decrypt(encrypted))
      })

      it('Should rise an exception if the payload is invalid', () => {
        expect(() => crypter.decrypt(encryptedInvalidPayload)).Throw('Invalid payload.')
      })

      it('Should rise an exception if the MAC is invalid', () => {
        const crypter = new Crypter(otherKey, algo)

        if (algo === 'aes-128-cbc' || algo === 'aes-256-cbc') {
          return expect(() => crypter.decrypt(encrypted), algo).Throw('Invalid MAC.')
        }

        expect(() => crypter.decrypt(encrypted)).Throw('Unsupported state or unable to authenticate data')
      })
    })

    describe('# Encrypt', () => {
      it('Should encrypt a string correctly', () => {
        const original = 'test-string'
        const encrypted = crypter.encrypt(original)
        const decrypted = crypter.decrypt(encrypted)

        expect(decrypted).equal(original)
      })
    })
  })
})
