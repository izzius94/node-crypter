#!/usr/bin/env node

import { generateKey } from './index'
import { algo } from './lib/key'

const setAlgo = (algo: string | undefined): algo => {
  if (algo === undefined) {
    return 'aes-256-cbc'
  }

  if (algo === 'aes-256-cbc' || algo === 'aes-128-cbc') {
    return algo
  }

  console.error(`Invalid algorithm: ${algo}`)
  process.exit(1)
}

const key = generateKey(setAlgo(process.argv[2]))

console.info('Encryption key: ' + key)
process.exit(0)
