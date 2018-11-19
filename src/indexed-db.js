//
// IronDB - A resilient key-value store for browsers.
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

const DEFAULT_DATABASE_NAME = 'IronDB'
const DEFAULT_STORE_NAME = 'key-value-pairs'

class IndexedDbStore {
  constructor (dbName = DEFAULT_DATABASE_NAME, storeName = DEFAULT_STORE_NAME) {
    this.store = new Store(dbName, storeName)

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
    const value = await idbGet(key, this.store)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    await idbSet(key, value, this.store)
  }

  async remove (key) {
    await idbRemove(key, this.store)
  }
}

export { IndexedDbStore }
