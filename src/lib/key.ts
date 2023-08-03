import { randomBytes } from 'crypto'

/**
 * Generate a new encryption key string encoded in base64
 *
 * @param algorithm The algorithm that will be used to encrypt/decrypt the data
 * @returns The encryption key
 */
export const generate = (algorithm: algorithm = 'aes-256-cbc'): string => {
  return Buffer.from(randomBytes(config[algorithm])).toString('base64')
}

/**
 * Read an encryption key from a base64 encoded string
 *
 * @param based The base64 enconded encryption key
 * @returns The buffer rappresenting the key
 */
export const read = (based: string): Buffer => {
  return Buffer.from(based, 'base64')
}

/**
 * The key lenght for each algorithm
 */
export const config = {
  'aes-128-cbc': 16,
  'aes-256-cbc': 32,
  'aes-256-gcm': 32,
  'aes-128-gcm': 16
}

/**
 * The supported algorithms
 */
export type algorithm = 'aes-128-cbc' | 'aes-256-cbc' | 'aes-256-gcm' | 'aes-128-gcm'
