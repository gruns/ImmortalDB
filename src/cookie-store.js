//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

import Cookies from 'js-cookie'

const DEFAULT_COOKIE_TTL = 365 // Days.

class CookieStore {
  constructor (ttl = DEFAULT_COOKIE_TTL) {
    this.options = {
      expires: ttl, ...(typeof CookieStore.storeOptions !== 'object'
        ? {}
        : CookieStore.storeOptions),
    }
    return (async () => this)()
  }

  static setStoreOptions (options) {
    CookieStore.storeOptions = options
  }

  async get (key) {
    const value = Cookies.get(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    Cookies.set(key, value, this.options)
  }

  async remove (key) {
    Cookies.remove(key, this.options)
  }
}

export { CookieStore }
