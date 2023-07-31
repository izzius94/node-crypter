import { Hmac, createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { algo } from './key'

/**
 * Decrypt an encrypted string
 *
 * @param encrypted The string to decrypt
 * @param key The key to be used to encrypt the string, if not provided the default key is used
 * @returns The string decrypted
 */
export const decrypt = (encrypted: string, key: Buffer, algo: algo = 'aes-256-cbc'): string => {
  const data = getJsonPayload(encrypted, key)
  const decipher = createDecipheriv(algo, Buffer.from(key), Buffer.from(data.iv, 'base64'))
  const decrypted = decipher.update(data.value, 'base64')

  return Buffer.concat([decrypted, decipher.final()]).toString()
}

/**
 * Enctypt a string
 *
 * @param value The value to encrypt
 * @param key The key to be used to encrypt the string, if not provided the default key is used
 * @returns The string encrypted
 */
export const encrypt = (value: string, key: Buffer, algo: algo = 'aes-256-cbc'): string => {
  const iv = randomBytes(16)
  const ivBased = iv.toString('base64')
  const cipher = createCipheriv(algo, Buffer.from(key), iv)
  const encrypted = cipher.update(value)
  const value64 = Buffer.concat([encrypted, cipher.final()]).toString('base64')

  return Buffer.from(
    JSON.stringify({
      iv: ivBased,
      value: value64,
      mac: hash(ivBased, value64, key).digest('hex')
    })
  ).toString('base64')
}

/**
 * Get the JSON object from the given payload.
 *
 * @param encrypted The payload to convert
 * @param key The key used for the encryption
 * @returns The converted payload
 */
const getJsonPayload = (encrypted: string, key: Buffer): IPayload => {
  const data: IPayload = JSON.parse(Buffer.from(encrypted, 'base64').toString('utf8'))

  if (!validJson(data)) {
    throw new Error('Invalid payload.')
  }

  if (!validMac(data, key)) {
    throw new Error('Invalid MAC.')
  }

  return data
}

/**
 * Check if the given paylod is valid
 *
 * @param payload The payload to check
 * @returns The validity of the payload
 */
const validJson = (payload: IPayload): boolean => {
  return typeof payload === 'object' && (payload.iv !== '' && payload.value !== '' && payload.mac !== '') && Buffer.from(payload.iv, 'base64').toString('ascii').length === 16
}

/**
 * Determine if the MAC for the given payload is valid.
 *
 * @param payload The payload to check
 * @param key The key used for the encryption
 * @returns The validity of the MAC
 */
const validMac = (payload: IPayload, key: Buffer): boolean => {
  return timingSafeEqual(
    Buffer.from(hash(payload.iv, payload.value, key).digest('base64'), 'base64'),
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
const hash = (iv: string, value: string, key: Buffer): Hmac => {
  const hmac = createHmac('sha256', key)
  hmac.update(iv + value)

  return hmac
}

/**
 * Describe the structure of a payload
 */
interface IPayload {
  iv: string
  value: string
  mac: string
}
