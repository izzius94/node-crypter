[![npm](https://badgen.net/npm/v/@izzius94/crypter)](https://www.npmjs.com/package/@izzius94/crypter)
[![npm](https://badgen.net/npm/dt/@izzius94/crypter)](https://www.npmjs.com/package/@izzius94/crypter)
[![License](https://badgen.net/github/license/izzius94/crypter)](https://github.com/izzius94/crypter/blob/main/LICENSE)
[![TS-Standard - TypeScript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

# @izzius94/crypter

The `crypter` library makes easy to share encrypted data with a Laravel project.

## Features

- Genaration of encryption keys
- Encryption of strings
- Decryption of strings

Currently serialization and deserialization is not supported.

> To mitigate this use [php-serialize](https://www.npmjs.com/package/php-serialize) library.

## Usage

### Creation of encryption key

```typescript
import { generateKey } from '@izzius94/crypter'

// Will output a string similar to TkIRuk6C70E2ExHunuX+wg3CwX+kcgkbg59Yhwiqi7s=
console.log(generateKey())

```

### Using the Crypter to encrypt and decrypt a string

```typescript
import { Crypter, readKey } from '@izzius94/crypter'

const crypter = new Crypter(readKey('TkIRuk6C70E2ExHunuX+wg3CwX+kcgkbg59Yhwiqi7s='))
const original = 'my-string'
const crypted = crypter.encrypt(original)
const decrypted = crypter.decrypt(crypted)

// Will output true
console.log(original === decrypted)

```

### Using a different key to encrypt/decrypt strings

Sometimes you will need to encrypt/decrypt strings using a different key, to do this simply pass the wanted key as the second parameter to `encrypt` and `decrypt` methods.

```typescript
import { Crypter, readKey } from '@izzius94/crypter'

const crypter = new Crypter(readKey('TkIRuk6C70E2ExHunuX+wg3CwX+kcgkbg59Yhwiqi7s='))
const key = readKey('8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U==')
const original = 'my-string'
const crypted = crypter.encrypt(original, key)
const decrypted = crypter.decrypt(crypted, key)

console.log(original === decrypted)

```

## License
Copyright © 2023 Maurizio Urso Released under the MIT license
