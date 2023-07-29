import { randomBytes } from "crypto"

/**
 * Generate a new encryption key
 *
 * @returns The buffer rappresenti the key
 */
export const generate = (stringfy: boolean = true): Buffer|string => {
  const key = Buffer.from(randomBytes(32))
  
  return stringfy ? key.toString('base64') : key
}
