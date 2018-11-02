//
// IronDB - A resilient key-value store for browsers.
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
    this.ttl = ttl
  }

  async get (key) {
    const value = Cookies.get(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    Cookies.set(key, value, { expires: this.ttl })
  }

  async remove (key) {
    Cookies.remove(key, { expires: this.ttl })
  }
}

export { CookieStore }
