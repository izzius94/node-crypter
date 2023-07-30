import { expect } from 'chai'
import { decrypt, encrypt } from '../../src/lib/crypt'
import { key, encrypted, encryptedInvalidPayload, anotherKey } from '../config'

describe('crypt', () => {
  describe('# decrypt', () => {
    it('Should decrypt a string', () => {
      expect('test-string').equal(decrypt(encrypted, key))
    })

    it('Should rise an exception if the payload is invalid', () => {
      expect(() => decrypt(encryptedInvalidPayload, key)).Throw('Invalid payload.')
    })

    it('Should rise an exception if the MAC is invalid', () => {
      expect(() => decrypt(encrypted, anotherKey)).Throw('Invalid MAC.')
    })
  })
  describe('# encrypt', () => {
    it('Should encrypt a string correctly', () => {
      const original = 'test-string'
      const encrypted = encrypt(original, key)
      const decrypted = decrypt(encrypted, key)

      expect(decrypted).equal(original)
    })
  })
})
