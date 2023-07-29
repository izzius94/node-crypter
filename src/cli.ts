#!/usr/bin/env node

import { generateKey } from './index'

const key = generateKey()

if (key instanceof Buffer) {
  console.info('Encryption key: ' + key.toString('base64'))
  process.exit()
}
console.info('Encryption key: ' + key)
