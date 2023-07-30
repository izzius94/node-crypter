import Crypter from '../../src/lib/crypter'
import { randomBytes } from 'crypto'
import { expect } from 'chai'
import { read } from '../../src/lib/key'
import { key, encrypted, encryptedInvalidPayload, anotherKey } from '../config'


const crypter = new Crypter(key)

describe('Crypter', () => {
  describe('Initialization', () => {
    it('Should rise an exception if an invalid encryption key is provided', () => {
      expect(() => new Crypter(Buffer.from(randomBytes(1)))).Throw('Invalid key lenght.')
    })
  })
  describe('Decrypt', () => {
    it('Should decrypt a string', () => {
      expect('test-string').equal(crypter.decrypt(encrypted))
    })

    it('Should rise an exception if the payload is invalid', () => {
      expect(() => crypter.decrypt(encryptedInvalidPayload)).Throw('Invalid payload.')
    })

    it('Should rise an exception if the MAC is invalid', () => {
      const crypter = new Crypter(anotherKey)

      expect(() => crypter.decrypt(encrypted)).Throw('Invalid MAC.')
    })
  })
  describe('Encrypt', () => {
    it('Should encrypt a string correctly', () => {
      const original = 'test-string'
      const encrypted = crypter.encrypt(original)
      const decrypted = crypter.decrypt(encrypted)

      expect(decrypted).equal(original)
    })
  })
})
