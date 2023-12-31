import { Hmac, createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual, getCipherInfo, Decipher } from 'crypto'
import { algorithm } from './key'

/**
 * Decrypt an encrypted string
 *
 * @param encrypted The encrypted string to decrypt
 * @param key The key to use to decrypt the string, must be the same used during encryption
 * @param algorithm The algorithm to use use to decrypt the string, must be the same used during encryption
 * @returns The string decrypted
 */
export const decrypt = (encrypted: string, key: Buffer, algorithm: algorithm = 'aes-256-cbc'): string => {
  const payload = getJsonPayload(encrypted, key, algorithm)

  ensureTagIsValid(payload.tag === undefined || payload.tag === '' ? null : payload.tag, algorithm)

  const decipher = createDecipher(algorithm, key, payload)
  const decrypted = decipher.update(payload.value, 'base64')

  return Buffer.concat([decrypted, decipher.final()]).toString()
}

/**
 * Enctypt a string
 *
 * @param value The value to encrypt
 * @param key The key to use to encrypt the string
 * @param algorithm The algorithm to use to encrypt the string
 * @returns The string encrypted
 */
export const encrypt = (value: string, key: Buffer, algorithm: algorithm = 'aes-256-cbc'): string => {
  if (algorithm === 'aes-256-gcm' || algorithm === 'aes-128-gcm') {
    const iv = randomBytes(12)
    const cipher = createCipheriv(algorithm, key, iv, { authTagLength: 16 })
    const encrypted = cipher.update(value)

    const payload: IPayload = {
      iv: iv.toString('base64'),
      value: Buffer.concat([encrypted, cipher.final()]).toString('base64'),
      mac: '',
      tag: cipher.getAuthTag().toString('base64')
    }

    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  const iv = randomBytes(16)
  const ivBased = iv.toString('base64')
  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = cipher.update(value)
  const value64 = Buffer.concat([encrypted, cipher.final()]).toString('base64')
  const payload: IPayload = {
    iv: iv.toString('base64'),
    value: value64,
    mac: hash(ivBased, value64, key).digest('hex'),
    tag: ''
  }

  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

/**
 * Get the JSON object from the given payload.
 * It can rise errors if the json is invalid or the MAC is invalid
 *
 * @param encrypted The encrypted string to decrypt
 * @param key The key to use to decrypt the string, must be the same used during encryption
 * @param algorithm The algorithm to use use to decrypt the string, must be the same used during encryption
 * @returns The payload converted in object
 */
const getJsonPayload = (encrypted: string, key: Buffer, algorithm: algorithm): IPayload => {
  const payload: IPayload = JSON.parse(Buffer.from(encrypted, 'base64').toString('utf8'))

  if (!validPayload(payload, algorithm)) {
    throw new Error('Invalid payload.')
  }

  if (algorithm !== 'aes-256-gcm' && algorithm !== 'aes-128-gcm' && !validMac(payload, key)) {
    throw new Error('Invalid MAC.')
  }

  return payload
}

/**
 * Check if the given paylod is valid
 *
 * @param payload The payload contained in the encrypted string
 * @param algorithm The algorithm to use use to decrypt the string, must be the same used during encryption
 * @returns
 */
const validPayload = (payload: IPayload, algorithm: algorithm): boolean => {
  if (typeof payload !== 'object') {
    return false
  }

  ['iv', 'value', 'mac'].forEach(el => {
    if (payload[el] === null || payload[el] === undefined || typeof payload[el] !== 'string') {
      return false
    }
  })

  return Buffer.from(payload.iv, 'base64').toString('ascii').length === getCipherInfo(algorithm)?.ivLength
}

/**
 * Determine if the MAC for the given payload is valid.
 *
 * @param payload The payload to check
 * @param key The key to use to decrypt the string, must be the same used during encryption
 * @returns The validity of the MAC
 */
const validMac = (payload: IPayload, key: Buffer): boolean => {
  return timingSafeEqual(
    hash(payload.iv, payload.value, key).digest(),
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
 * @param algorithm The algorithm to use to decrypt the value in the payload
 * @param key The key to use to decrypt the value in the payload
 * @param payload The payload object
 * @returns
 */
const createDecipher = (algorithm: algorithm, key: Buffer, payload: IPayload): Decipher => {
  if (algorithm === 'aes-256-gcm' || algorithm === 'aes-128-gcm') {
    return createDecipheriv(algorithm, key, Buffer.from(payload.iv, 'base64'), { authTagLength: 16 })
      .setAuthTag(Buffer.from(payload.tag, 'base64'))
  }

  return createDecipheriv(algorithm, key, Buffer.from(payload.iv, 'base64'))
}

/**
 * Ensure the given tag is a valid tag given the selected cipher
 *
 * @param tag The tag contained in the payload
 * @param algorithm The algorithm to use to decrypt the value in the payload
 */
const ensureTagIsValid = (tag: string | null, algorithm: algorithm): void => {
  if ((algorithm === 'aes-128-gcm' || algorithm === 'aes-256-gcm') && (tag === null || Buffer.from(tag, 'base64').length !== 16)) {
    throw new Error('Could not decrypt the data.')
  }

  if ((algorithm === 'aes-128-cbc' || algorithm === 'aes-256-cbc') && typeof tag === 'string') {
    throw new Error('Unable to use tag because the cipher algorithm does not support AEAD.')
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
