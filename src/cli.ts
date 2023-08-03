#!/usr/bin/env node

import { generateKey } from './index'
import { algorithm } from './lib/key'

const setAlgo = (algorithm: string | undefined): algorithm => {
  if (algorithm === undefined) {
    return 'aes-256-cbc'
  }

  if (algorithm === 'aes-256-cbc' || algorithm === 'aes-128-cbc' || algorithm === 'aes-256-gcm' || algorithm === 'aes-128-gcm') {
    return algorithm
  }

  console.error(`Invalid algorithm: ${algorithm}`)
  process.exit(1)
}

const key = generateKey(setAlgo(process.argv[2]))

console.info('Encryption key: ' + key)
process.exit(0)
