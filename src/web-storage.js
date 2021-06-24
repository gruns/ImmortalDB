//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

const EXPIRES_PREFIX = 'exp_'

class StorageApiWrapper {
  constructor (store, expiresPrefix = EXPIRES_PREFIX) {
    this.store = store
    this.expiresPrefix = expiresPrefix

    return (async () => this)()
  }

  async get (key) {
    const val = await this.getExpires(key)
    if (val && val <= new Date().getTime()) {
      await this.remove(key)
    }

    const value = this.store.getItem(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value, options = { expires: 0, isExpiresDate: false }) {
    this.store.setItem(key, value)

    if (options && options.expires) {
      // If expire exists, update or add it.
      this.store.setItem(
        this.expiresPrefix + key,
        options.isExpiresDate
          ? options.expires.toString()
          : new Date(new Date().getTime() + options.expires * 60 * 1000)
              .getTime()
              .toString(),
      )
    } else {
      // If it doesn't exist, remove any existing expiration
      this.store.removeItem(this.expiresPrefix + key)
    }
  }

  async getExpires (key) {
    const value = await this.store.getItem(this.expiresPrefix + key)
    return typeof value === 'string' ? +value : 0
  }

  async remove (key) {
    this.store.removeItem(key)
    this.store.removeItem(this.expiresPrefix + key)
  }
}

class LocalStorageStore extends StorageApiWrapper {
  constructor () {
    super(window.localStorage)
  }
}

class SessionStorageStore extends StorageApiWrapper {
  constructor () {
    super(window.sessionStorage)
  }
}

export { LocalStorageStore, SessionStorageStore }
