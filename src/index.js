//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

import { CookieStore } from './cookie-store'
import { IndexedDbStore } from './indexed-db'
import { LocalStorageStore, SessionStorageStore } from './web-storage'

const cl = console.log
const DEFAULT_KEY_PREFIX = '_immortal|'
const WINDOW_IS_DEFINED = typeof window !== 'undefined'

// Stores must implement asynchronous constructor, get(), set(), and
// remove() methods.
const DEFAULT_STORES = [CookieStore]
try {
  if (WINDOW_IS_DEFINED && window.indexedDB) {
    DEFAULT_STORES.push(IndexedDbStore)
  }
} catch (err) {}

try {
  if (WINDOW_IS_DEFINED && window.localStorage) {
    DEFAULT_STORES.push(LocalStorageStore)
  }
} catch (err) {}

function arrayGet (arr, index, _default = null) {
  if (index in arr) {
    return arr[index]
  }
  return _default
}

function countUniques (iterable) {
  // A Map must be used instead of an Object because JavaScript is a
  // buttshit language and all Object keys are serialized to strings.
  // Thus undefined becomes 'undefined', null becomes 'null', etc. Then,
  // in turn, 'undefined' can't be differentiated from undefined, null
  // from 'null', etc, and countUniques([null, 'null']) would
  // incorrectly return {'null': 2} instead of {null: 1, 'null': 1}.
  //
  // Unfortunately this Object behavior precludes the use of
  // lodash.countBy() and similar methods which count with Objects
  // instead of Maps.
  const m = new Map()
  let eles = iterable.slice()

  for (const ele of eles) {
    let count = 0
    for (const obj of eles) {
      if (ele === obj) {
        count += 1
      }
    }

    if (count > 0) {
      m.set(ele, count)
      eles = eles.filter(obj => obj !== ele)
    }
  }

  return m
}

class ImmortalStorage {
  constructor (stores = DEFAULT_STORES) {
    this.stores = []

    // Initialize stores asynchronously. Accept both instantiated store
    // objects and uninstantiated store classes. If the latter,
    // implicitly instantiate instances thereof in this constructor.
    //
    // This constructor must accept both instantiated store objects and
    // uninstantiated store classes because it's impossible to export
    // ImmortalStore if it only took store objects initialized
    // asynchronously. Like:
    //
    //   ;(async () => {
    //       const cookieStore = await CookieStore()
    //       const ImmortalDB = new ImmortalStorage([cookieStore])
    //       export { ImmortalDB }  // <----- Doesn't work.
    //   })
    //
    // So to export a synchronous ImmortalStorage class, datastore
    // classes (whose definitions are synchronous) must be accepted in
    // addition to instantiated store objects.
    this.onReady = (async () => {
      this.stores = (
        await Promise.all(
          stores.map(async StoreClassOrInstance => {
            if (typeof StoreClassOrInstance === 'object') {
              // Store instance.
              return StoreClassOrInstance
            } else {
              // Store class.
              try {
                return await new StoreClassOrInstance() // Instantiate instance.
              } catch (err) {
                // TODO(grun): Log (where?) that the <Store> constructor Promise
                // failed.
                return null
              }
            }
          }),
        )
      ).filter(Boolean)
    })()
  }

  async get (key, _default = null) {
    await this.onReady

    const prefixedKey = `${DEFAULT_KEY_PREFIX}${key}`

    const values = await Promise.all(
      this.stores.map(async store => {
        try {
          return await store.get(prefixedKey)
        } catch (err) {
          cl(err)
        }
      }),
    )

    const expiresValues = await Promise.all(
      this.stores.map(async store => {
        try {
          return await store.getExpires(prefixedKey)
        } catch (err) {}
      }),
    )

    const countedExpires = Array.from(countUniques(expiresValues).entries())
    countedExpires.sort((a, b) => a[1] <= b[1])
    let expires
    const [firstVal, firstCo] = arrayGet(countedExpires, 0, [undefined, 0])
    const [secondVal, secondCo] = arrayGet(countedExpires, 1, [undefined, 0])
    if (
      firstCo > secondCo ||
      (firstCo === secondCo && firstVal !== undefined)
    ) {
      expires = firstVal
    } else {
      expires = secondVal
    }

    const counted = Array.from(countUniques(values).entries())
    counted.sort((a, b) => a[1] <= b[1])

    let value
    const [firstValue, firstCount] = arrayGet(counted, 0, [undefined, 0])
    const [secondValue, secondCount] = arrayGet(counted, 1, [undefined, 0])
    if (
      firstCount > secondCount ||
      (firstCount === secondCount && firstValue !== undefined)
    ) {
      value = firstValue
    } else {
      value = secondValue
    }

    if (value !== undefined) {
      await this.set(key, value, { expires, isExpiresDate: true })
      return value
    } else {
      await this.remove(key)
      return _default
    }
  }

  async set (key, value, options = { expires: 0 }) {
    await this.onReady

    key = `${DEFAULT_KEY_PREFIX}${key}`

    await Promise.all(
      this.stores.map(async store => {
        try {
          await store.set(key, value, options)
        } catch (err) {
          cl(err)
        }
      }),
    )

    return value
  }

  async remove (key) {
    await this.onReady

    key = `${DEFAULT_KEY_PREFIX}${key}`

    await Promise.all(
      this.stores.map(async store => {
        try {
          await store.remove(key)
        } catch (err) {
          cl(err)
        }
      }),
    )
  }
}

const ImmortalDB = new ImmortalStorage()

export {
  ImmortalDB,
  ImmortalStorage,
  CookieStore,
  IndexedDbStore,
  LocalStorageStore,
  SessionStorageStore,
  DEFAULT_STORES,
  DEFAULT_KEY_PREFIX,
}
