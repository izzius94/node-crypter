import { Hmac, createDecipheriv, createHmac, timingSafeEqual } from "crypto"

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
   * @param key The key to be used to encrypt the string, if not provided the default key is used
   * @returns The string decrypted
   */
  public decrypt (encrypted: string, key: Buffer = this.key): string {
    this.checkKey(key)
    const data = this.getJsonPayload(encrypted, key)
    const decipher = createDecipheriv('AES-256-CBC', Buffer.from(key), Buffer.from(data.iv, 'base64'))
    const decrypted = decipher.update(data.value, 'base64')

    return Buffer.concat([decrypted, decipher.final()]).toString()
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

  /**
   * Get the JSON object from the given payload.
   *
   * @param encrypted The payload to convert
   * @param key The key used for the encryption
   * @returns The converted payload
   */
  protected getJsonPayload (encrypted: string, key: Buffer): IPayload {
    const data: IPayload = JSON.parse(Buffer.from(encrypted, 'base64').toString('utf8'))

    if (!this.validJson(data)) {
      throw new Error('Invalid payload')
    }

    if (!this.validMac(data, key)) {
      throw new Error('Invalid MAC')
    }

    return data
  }

  /**
   * Check if the given paylod is valid
   *
   * @param payload The payload to check
   * @returns The validity of the payload
   */
  protected validJson (payload: IPayload): boolean {
    return typeof payload === 'object' && (payload.iv !== '' && payload.value !== '' && payload.mac !== '') && Buffer.from(payload.iv, 'base64').toString('ascii').length === 16
  }

  /**
   * Determine if the MAC for the given payload is valid.
   *
   * @param payload The payload to check
   * @param key The key used for the encryption
   * @returns The validity of the MAC
   */
  protected validMac (payload: IPayload, key: Buffer): boolean {
    return timingSafeEqual(
      Buffer.from(this.hash(payload.iv, payload.value, key).digest('base64'), 'base64'),
      Buffer.from(payload.mac, 'hex')
    )
  }

  /**
   * Create a MAC for the given value
   *
   * @param iv The iv used to create the hash
   * @param value The value used to create the hash
   * @param key The key used to create the hash
   * @returns The hash
   */
  protected hash (iv: string, value: string, key: Buffer): Hmac {
    const hmac = createHmac('sha256', key)
    hmac.update(iv + value)

    return hmac
  }
}

/**
 * Describe the structure of a payload
 */
interface IPayload {
  iv: string
  value: string
  mac: string
}
