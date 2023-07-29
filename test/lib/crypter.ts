import Crypter from '../../src/lib/crypter'
import { randomBytes } from 'crypto';
import { expect } from 'chai'

describe('Crypter', () => {
  describe('Initialization', () => {
    it('Should rise an exception if an invalid encryption key is provided', () => {
      expect(() => {new Crypter(Buffer.from(randomBytes(1)))}).Throw('Invalid key lenght.')
    })
  })
})