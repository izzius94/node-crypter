import { decrypt, encrypt } from './crypt'
import { algo, config } from './key'

export default class {
  protected readonly key: Buffer
  protected readonly algo: algo

  constructor (key: Buffer, algo: algo = 'aes-256-cbc') {
    this.checkKey(key, algo)
    this.key = key
    this.algo = algo
  }

  /**
   * Method to decrypt an encrypted string
   *
   * @param encrypted The string to decrypt
   * @returns The string decrypted
   */
  public decrypt (encrypted: string): string {
    return decrypt(encrypted, this.key, this.algo)
  }

  /**
   * Method to enctypt a string
   *
   * @param value The value to encrypt
   * @returns The string encrypted
   */
  public encrypt (value: string): string {
    return encrypt(value, this.key, this.algo)
  }

  /**
   * Method to check if the provided key is valid
   *
   * @param key The key to check
   */
  protected checkKey (key: Buffer, algo: algo): void {
    if (key.toString('ascii').length !== config[algo]) {
      throw Error('Invalid key lenght.')
    }
  }
}
