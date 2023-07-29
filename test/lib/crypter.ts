import Crypter from '../../src/lib/crypter'
import { randomBytes } from 'crypto';
import { expect } from 'chai'
import { read } from '../../src/lib/key';

describe('Crypter', () => {
  describe('Initialization', () => {
    it('Should rise an exception if an invalid encryption key is provided', () => {
      expect(() => {new Crypter(Buffer.from(randomBytes(1)))}).Throw('Invalid key lenght.')
    })
  })
  describe('Decrypt', () => {
    it('Should decrypt a string', () => {
      const crypter = new Crypter(read('1OvhreDcn1XxUcu8Pj1OgY7IIAD9cQzKB2vdu2YRLrw='))
      
      expect('test-string').equal(crypter.decrypt('eyJpdiI6IlRWaDZIZCtiNHJQMFJTNnhtOEJ4dkE9PSIsInZhbHVlIjoiYVlGL0RFWHhBR0N5Z011RjU0T2gwQT09IiwibWFjIjoiYzM1NWY0MjE2NDc0ZWM4ZjExNDRmYzRiYWFhOWZkYmJhY2VkNDEyZWY5NTc0Yjg0N2VjNTZhNTlmNGMwZTZhNiIsInRhZyI6IiJ9='))
    })
  })
})