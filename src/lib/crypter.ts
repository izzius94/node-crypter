export default class {
  protected readonly key: Buffer

  constructor (key: Buffer) {
    this.checkKey(key)
    this.key = key
  }

  /**
   * Method to check if the provided key is valid
   *
   * @param key The key to check
   */
  protected checkKey (key: Buffer): void {
    if (key.toString('ascii').length !== 32) {
      throw Error('Invalid key lenght.')
    }
  }
}
