import { randomBytes } from 'crypto'

/**
 * Generate a new encryption key string encoded in base64
 *
 * @returns The encryption key
 */
export const generate = (algo: algo = 'aes-256-cbc'): string => {
  return Buffer.from(randomBytes(config[algo])).toString('base64')
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

export const config = {
  'aes-128-cbc': 16,
  'aes-256-cbc': 32
}

export type algo = 'aes-128-cbc' | 'aes-256-cbc'
