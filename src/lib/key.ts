import { randomBytes } from "crypto"

/**
 * Generate a new encryption key, by default it is served as a
 * string encoded in base64
 *
 * @returns The encryption key
 */
export const generate = (stringfy: boolean = true): Buffer|string => {
  const key = Buffer.from(randomBytes(32))
  
  return stringfy ? key.toString('base64') : key
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
