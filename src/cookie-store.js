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
// If this script is executing in a cross-origin iframe, the cookie must
// be set with SameSite=None and Secure=true. See
// https://web.dev/samesite-cookies-explained/ and
// https://tools.ietf.org/html/draft-west-cookie-incrementalism-00 for
// details on SameSite and cross-origin behavior.
const CROSS_ORIGIN_IFRAME = amIInsideACrossOriginIframe()
const DEFAULT_SECURE = !!CROSS_ORIGIN_IFRAME
const DEFAULT_SAMESITE = CROSS_ORIGIN_IFRAME ? 'None' : 'Lax'

function amIInsideACrossOriginIframe () {
  try {
    // Raises ReferenceError if window isn't defined, eg if executed
    // outside a browser.
    //
    // If inside a cross-origin iframe, raises: Uncaught
    // DOMException: Blocked a frame with origin "..." from
    // accessing a cross-origin frame.
    return !window.top.location.href
  } catch (err) {
    return true
  }
}

class CookieStore {
  constructor ({
    ttl = DEFAULT_COOKIE_TTL,
    secure = DEFAULT_SECURE,
    sameSite = DEFAULT_SAMESITE,
  } = {}) {
    this.ttl = ttl
    this.secure = secure
    this.sameSite = sameSite

    return (async () => this)()
  }

  async get (key) {
    const value = Cookies.get(key)
    console.log(Cookies.expires)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value, options = { expires: 0, isExpiresDate: false }) {
    let opts = {}
    if (options && options.expires) {
      opts.expires = options.isExpiresDate
        ? new Date(options.expires)
        : new Date(new Date().getTime() + options.expires * 60 * 1000)
    }
    Cookies.set(key, value, this._constructCookieParams(opts))
  }

  async remove (key) {
    Cookies.remove(key, this._constructCookieParams())
  }

  _constructCookieParams (
    options = {
      expires: this.tll,
      secure: this.secure,
      sameSite: this.sameSite,
    },
  ) {
    const opts = {
      expires: this.tll,
      secure: this.secure,
      sameSite: this.sameSite,
    }

    const keys = Object.keys(opts)
    for (let i = 0; i < keys.length; i++) {
      if (options[keys[i]]) {
        opts[keys[i]] = options[keys[i]]
      }
    }

    return opts
  }
}

export { CookieStore }
