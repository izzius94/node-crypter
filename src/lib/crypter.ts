import { decrypt, encrypt } from './crypt'
import { algorithm, config } from './key'

export default class {
  protected readonly key: Buffer
  protected readonly algorithm: algorithm

  /**
   * Initialize the class
   *
   * @param key The key used to encrypt/decrypt the strings
   * @param algorithm The algorithm used to encrypt/decrypt the strings
   */
  constructor (key: Buffer, algorithm: algorithm = 'aes-256-cbc') {
    this.key = key
    this.algorithm = algorithm

    this.checkKey()
  }

  /**
   * Method to decrypt an encrypted string
   *
   * @param encrypted The string to decrypt
   * @returns The string decrypted
   */
  public decrypt (encrypted: string): string {
    return decrypt(encrypted, this.key, this.algorithm)
  }

  /**
   * Method to enctypt a string
   *
   * @param value The value to encrypt
   * @returns The string encrypted
   */
  public encrypt (value: string): string {
    return encrypt(value, this.key, this.algorithm)
  }

  /**
   * Method to check if the provided key is valid
   */
  protected checkKey (): void {
    if (this.key.toString('ascii').length !== config[this.algorithm]) {
      throw Error('Invalid key length.')
    }
  }
}
