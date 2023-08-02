import { Hmac, createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual, getCipherInfo, Decipher } from 'crypto'
import { algo } from './key'

/**
 * Decrypt an encrypted string
 *
 * @param encrypted The string to decrypt
 * @param key The key to be used to encrypt the string, if not provided the default key is used
 * @returns The string decrypted
 */
export const decrypt = (encrypted: string, key: Buffer, algo: algo = 'aes-256-cbc'): string => {
  const data = getJsonPayload(encrypted, key, algo)

  ensureTagIsValid(data.tag === undefined || data.tag === '' ? null : data.tag, algo)

  const decipher = createDecipher(algo, key, data)
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
  if (algo === 'aes-256-gcm' || algo === 'aes-128-gcm') {
    const iv = randomBytes(12)
    const ivBased = iv.toString('base64')
    const cipher = createCipheriv(algo, Buffer.from(key), iv, { authTagLength: 16 })
    const encrypted = cipher.update(value)
    const value64 = Buffer.concat([encrypted, cipher.final()]).toString('base64')

    return Buffer.from(
      JSON.stringify({
        iv: ivBased,
        value: value64,
        mac: '',
        tag: cipher.getAuthTag().toString('base64')
      })
    ).toString('base64')
  }

  const iv = randomBytes(16)
  const ivBased = iv.toString('base64')
  const cipher = createCipheriv(algo, Buffer.from(key), iv)
  const encrypted = cipher.update(value)
  const value64 = Buffer.concat([encrypted, cipher.final()]).toString('base64')

  return Buffer.from(
    JSON.stringify({
      iv: ivBased,
      value: value64,
      mac: hash(ivBased, value64, key).digest('hex'),
      tag: ''
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
const getJsonPayload = (encrypted: string, key: Buffer, algo: algo): IPayload => {
  const data: IPayload = JSON.parse(Buffer.from(encrypted, 'base64').toString('utf8'))

  if (!validJson(data, algo)) {
    throw new Error('Invalid payload.')
  }

  if (algo !== 'aes-256-gcm' && algo !== 'aes-128-gcm' && !validMac(data, key)) {
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
const validJson = (payload: IPayload, algo: algo): boolean => {
  if (typeof payload !== 'object') {
    return false
  }

  ['iv', 'value', 'mac'].forEach(el => {
    if (payload[el] === null || payload[el] === undefined || typeof payload[el] !== 'string') {
      return false
    }
  })

  return Buffer.from(payload.iv, 'base64').toString('ascii').length === getCipherInfo(algo)?.ivLength
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
 * Create the decipher for decryption
 *
 * @param algo The algorithm used
 * @param key The key used
 * @param data The data in the payload
 * @returns
 */
const createDecipher = (algo: algo, key: Buffer, data: IPayload): Decipher => {
  if (algo === 'aes-256-gcm' || algo === 'aes-128-gcm') {
    return createDecipheriv(algo, Buffer.from(key), Buffer.from(data.iv, 'base64'), { authTagLength: 16 })
      .setAuthTag(Buffer.from(data.tag, 'base64'))
  }

  return createDecipheriv(algo, Buffer.from(key), Buffer.from(data.iv, 'base64'))
}

/**
 * Ensure the given tag is a valid tag given the selected cipher
 *
 * @param tag The tag used
 * @param algo The algorithm used
 */
const ensureTagIsValid = (tag: string | null, algo: algo): void => {
  if ((algo === 'aes-128-gcm' || algo === 'aes-256-gcm') && (tag === null || Buffer.from(tag, 'base64').length !== 16)) {
    throw new Error('Could not decrypt the data.')
  }

  if ((algo === 'aes-128-cbc' || algo === 'aes-256-cbc') && typeof tag === 'string') {
    throw new Error('Unable to use tag because the cipher algorithm does not support AEAD.' + tag)
  }
}

/**
 * Describe the structure of a payload
 */
interface IPayload {
  iv: string
  value: string
  mac: string
  tag: string
}
