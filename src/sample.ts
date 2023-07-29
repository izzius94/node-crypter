import { Crypter, readKey } from './index'

const crypter = new Crypter(readKey('TkIRuk6C70E2ExHunuX+wg3CwX+kcgkbg59Yhwiqi7s='))
const key = readKey('8U6GU1Tp1/0Jb7/1BRCxpzQubzBKfs1Sm8V8Wtce4+U==')
const original = 'my-string'
const crypted = crypter.encrypt(original, key)
const decrypted = crypter.decrypt(crypted, key)

console.log(original === decrypted)
