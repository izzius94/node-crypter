[![npm](https://badgen.net/npm/v/@izzius94/crypter)](https://www.npmjs.com/package/@izzius94/crypter)
[![npm](https://badgen.net/npm/dt/@izzius94/crypter)](https://www.npmjs.com/package/@izzius94/crypter)
[![License](https://badgen.net/github/license/izzius94/node-crypter)](https://github.com/izzius94/node-crypter/blob/main/LICENSE)
[![TS-Standard - TypeScript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

# @izzius94/crypter

The `crypter` library makes easy to share encrypted data with a Laravel project.

## Features

- Genaration of encryption keys from command line
- Encryption of strings
- Decryption of strings

### Supported algorithms

- aes-256-cbc
- aes-128-cbc
- aes-256-gcm
- aes-128-gcm

### Missing features
Currently serialization and deserialization is not supported.

> To mitigate this use [php-serialize](https://www.npmjs.com/package/php-serialize) library.

## Usage

### Creation of encryption key

```bash
npx @izzius94/crypter

```

This command will output a new encryption key in yor console. This command accept the algorithm to use as a parameter. If the algorithm is not supported it will exit with an error

### Encrypt/decrypt strings

To encrypt/decrypt strings use `encrypt` and `decrypt` methods passing the encryption key as the second parameter.

```typescript
import { encrypt, decrypt } from '@izzius94/crypter'

const key = readKey('8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U==')
const original = 'my-string'
const crypted = crypter.encrypt(original, key)
const decrypted = crypter.decrypt(crypted, key)

console.log(original === decrypted)

```

### Using the Crypter class to encrypt and decrypt a string

Sometimes you will need to use the same key accross multiple classes. To help you do this you can use the class `Crypter` to share the same encryption key.

```typescript
import { Crypter, readKey } from '@izzius94/crypter'

const crypter = new Crypter(readKey('TkIRuk6C70E2ExHunuX+wg3CwX+kcgkbg59Yhwiqi7s='))
const original = 'my-string'
const crypted = crypter.encrypt(original)
const decrypted = crypter.decrypt(crypted)

// Will output true
console.log(original === decrypted)

```

## License
Copyright © 2023 Maurizio Urso Released under the MIT license
