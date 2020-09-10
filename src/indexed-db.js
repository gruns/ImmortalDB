//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

import {
  Store,
  get as idbGet,
  set as idbSet,
  del as idbRemove,
} from 'idb-keyval'

const DEFAULT_DATABASE_NAME = 'ImmortalDB'
const DEFAULT_STORE_NAME = 'key-value-pairs'
const DEFAULT_EXPIRES_DB_NAME = 'ImmortalDBExp'

class IndexedDbStore {
  constructor (
    dbName = DEFAULT_DATABASE_NAME,
    storeName = DEFAULT_STORE_NAME,
    expiresDBName = DEFAULT_EXPIRES_DB_NAME,
  ) {
    this.store = new Store(dbName, storeName)
    this.expiresStore = new Store(expiresDBName, storeName)

    return (async () => {
      // Safari throws a SecurityError if IndexedDB.open() is called in a
      // cross-origin iframe.
      //
      //   SecurityError: IDBFactory.open() called in an invalid security context
      //
      // Catch such and fail gracefully.
      //
      // TODO(grun): Update idb-keyval's Store class to fail gracefully in
      // Safari. Push the fix(es) upstream.
      try {
        await this.store._dbp
        await this.expiresStore._dbp
      } catch (err) {
        if (err.name === 'SecurityError') {
          return null // Failed to open an IndexedDB database.
        } else {
          throw err
        }
      }

      return this
    })()
  }

  async get (key) {
    const val = await this.getExpires(key)
    if (val && val <= new Date().getTime()) {
      await this.remove(key)
    }

    const value = await idbGet(key, this.store)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value, options = { expires: 0, isExpiresDate: false }) {
    await idbSet(key, value, this.store)

    if (options && options.expires) {
      // If expire exists, update or add it.
      await idbSet(
        key,
        options.isExpiresDate
          ? options.expires.toString()
          : new Date(new Date().getTime() + options.expires * 60 * 1000)
              .getTime()
              .toString(),
        this.expiresStore,
      )
    } else {
      // If it doesn't exist, remove any existing expiration
      await idbRemove(key, this.expiresStore)
    }
  }

  async getExpires (key) {
    const value = await idbGet(key, this.expiresStore)
    return typeof value === 'string' ? +value : 0
  }

  async remove (key) {
    await idbRemove(key, this.expiresStore)
    await idbRemove(key, this.store)
  }
}

export {
  IndexedDbStore,
  DEFAULT_DATABASE_NAME,
  DEFAULT_STORE_NAME,
  DEFAULT_EXPIRES_DB_NAME,
}
