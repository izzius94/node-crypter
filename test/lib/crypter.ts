import Crypter from '../../src/lib/crypter'
import { randomBytes } from 'crypto'
import { expect } from 'chai'
import { read } from '../../src/lib/key'

describe('Crypter', () => {
  describe('Initialization', () => {
    it('Should rise an exception if an invalid encryption key is provided', () => {
      expect(() => new Crypter(Buffer.from(randomBytes(1)))).Throw('Invalid key lenght.')
    })
  })
  describe('Decrypt', () => {
    const encrypted = 'eyJpdiI6IlRWaDZIZCtiNHJQMFJTNnhtOEJ4dkE9PSIsInZhbHVlIjoiYVlGL0RFWHhBR0N5Z011RjU0T2gwQT09IiwibWFjIjoiYzM1NWY0MjE2NDc0ZWM4ZjExNDRmYzRiYWFhOWZkYmJhY2VkNDEyZWY5NTc0Yjg0N2VjNTZhNTlmNGMwZTZhNiIsInRhZyI6IiJ9='
    it('Should decrypt a string', () => {
      const crypter = new Crypter(read('1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw='))

      expect('test-string').equal(crypter.decrypt(encrypted))
    })

    it('Should rise an exception if the payload is invalid', () => {
      const crypter = new Crypter(read('1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw'))

      expect(() => crypter.decrypt('eyJpdiI6IiIsInZhbHVlIjoiQm1DZDMrQWdxNEtrZ2Zta3I3WGFxUT09IiwibWFjIjoiOTFkOTMyZWEzZGM3NWFmZTI1NWI2OTE0YzVmN2RkMjk4NjI3MTY1OGQ5NTJhODc5ODgyNGZiODA2MDZlM2JiNCJ9'))
        .Throw('Invalid payload.')
    })

    it('Should rise an exception if the MAC is invalid', () => {
      const crypter = new Crypter(read('8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U=='))

      expect(() => crypter.decrypt(encrypted)).Throw('Invalid MAC.')
    })
  })
  describe('Encrypt', () => {
    it('Should encrypt a string correctly', () => {
      const crypter = new Crypter(read('1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw='))
      const original = 'test-string'
      const encrypted = crypter.encrypt(original)
      const decrypted = crypter.decrypt(encrypted)

      expect(decrypted).equal(original)
    })
  })
})
