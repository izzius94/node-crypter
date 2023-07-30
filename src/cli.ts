#!/usr/bin/env node

import { generateKey } from './index'

const key = generateKey()

console.info('Encryption key: ' + key)
