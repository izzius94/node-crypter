import { decrypt, encrypt } from './crypt'

export default class {
  protected readonly key: Buffer

  constructor (key: Buffer) {
    this.checkKey(key)
    this.key = key
  }

  /**
   * Method to decrypt an encrypted string
   *
   * @param encrypted The string to decrypt
   * @returns The string decrypted
   */
  public decrypt (encrypted: string): string {
    return decrypt(encrypted, this.key)
  }

  /**
   * Method to enctypt a string
   *
   * @param value The value to encrypt
   * @returns The string encrypted
   */
  public encrypt (value: string): string {
    return encrypt(value, this.key)
  }

  /**
   * Method to check if the provided key is valid
   *
   * @param key The key to check
   */
  protected checkKey (key: Buffer): void {
    if (key.toString('ascii').length !== 32) {
      throw Error('Invalid key lenght.')
    }
  }
}
