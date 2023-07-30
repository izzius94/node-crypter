import { randomBytes } from 'crypto'

/**
 * Generate a new encryption key string encoded in base64
 *
 * @returns The encryption key
 */
export const generate = (): string => {
  return Buffer.from(randomBytes(32)).toString('base64')
}

/**
 * Read an encryption key from a base64 encoded string
 *
 * @param based The based encryption key
 * @returns The buffer rappresenting the key
 */
export const read = (based: string): Buffer => {
  return Buffer.from(based, 'base64')
}
