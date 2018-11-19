//
// IronDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

class StorageApiWrapper {
  constructor (store) {
    this.store = store

    return (async () => this)()
  }

  async get (key) {
    const value = this.store.getItem(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    this.store.setItem(key, value)
  }

  async remove (key) {
    this.store.removeItem(key)
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
