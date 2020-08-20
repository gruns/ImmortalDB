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
const DEFAULT_SECURE = (CROSS_ORIGIN_IFRAME ? true : false)
const DEFAULT_SAMESITE = (CROSS_ORIGIN_IFRAME ? 'None' : 'Lax')


function amIInsideACrossOriginIframe () {
    try {
        // Raises ReferenceError if window isn't defined, eg if executed
        // outside a browser.
        //
        // If inside a cross-origin iframe, raises: Uncaught
        // DOMException: Blocked a frame with origin "..." from
        // accessing a cross-origin frame.
        return !Boolean(window.top.location.href)
    } catch (err) {
        return true
    }
}


class CookieStore {
    constructor ({
        ttl = DEFAULT_COOKIE_TTL,
        secure = DEFAULT_SECURE,
        sameSite = DEFAULT_SAMESITE} = {}) {
    this.ttl = ttl
    this.secure = secure
    this.sameSite = sameSite

    return (async () => this)()
  }

  async get (key) {
    const value = Cookies.get(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    Cookies.set(key, value, this._constructCookieParams())
  }

  async remove (key) {
    Cookies.remove(key, this._constructCookieParams())
  }

  _constructCookieParams () {
    return {
      expires: this.ttl,
      secure: this.secure,
      sameSite: this.sameSite,
    }
  }
}

export { CookieStore }
