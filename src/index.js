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
import get from 'lodash.get'
import last from 'lodash.last'
import sortBy from 'lodash.sortby'
import { CookieStore } from './cookie-store'
import { IndexedDbStore } from './indexed-db'
import { LocalStorageStore, SessionStorageStore } from './web-storage'


// Stores must implement asynchronous get(), set(), and remove() methods.
const STORE_CLASSES = [CookieStore]
if (window.indexedDB) {
    STORE_CLASSES.push(IndexedDbStore)
}
if (window.localStorage) {
    STORE_CLASSES.push(LocalStorageStore)
}
if (window.sessionStorage) {
    STORE_CLASSES.push(SessionStorageStore)
}


const cl = console.log
const DEFAULT_KEY_PREFIX = '_iron|'
const DEFAULT_STORES = STORE_CLASSES.map(klass => new klass())


function countUniques (iterable) {
    // A Map must be used instead of an Object because JavaScript is a buttshit
    // language and all Object keys are serialized to strings. Thus undefined
    // becomes 'undefined', null becomes 'null', etc and in turn null can't be
    // differentiated from 'null', 'undefined' from undefined, etc. E.g.
    // countUniques([null, 'null']) would incorrectly return {'null': 2} instead
    // of the correct {null: 1, 'null': 1}.
    //
    // Unfortunately this Object behavior precludes the use of lodash.countBy()
    // and similar methods which count with Objects instead of Maps.
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


class IronStorage {
    constructor (stores=DEFAULT_STORES) {
        this.stores = stores.filter(Boolean)
    }

    async get (key, _default=null) {
        const prefixedKey = `${DEFAULT_KEY_PREFIX}${key}`

        const values = await Promise.all(this.stores.map(async store => {
            try {
                return await store.get(prefixedKey)
            } catch (err) {
                cl(err)   
            }
        }))

        const counted = Array.from(countUniques(values).entries())
        const sorted = sortBy(counted, i => i[1]).reverse()

        let value = undefined
        const [firstValue, firstCount] = get(sorted, '[0]', [undefined, 0])
        const [secondValue, secondCount] = get(sorted, '[1]', [undefined, 0])
        if (firstCount > secondCount) {
            value = firstValue
        } else if (firstCount == secondCount) {
            value = (firstValue !== undefined ? firstValue : secondValue)
        }

        if (value !== undefined) {
            await this.set(key, value)
            return value
        } else {
            await this.remove(key)
            return _default
        }
    }

    async set (key, value) {
        key = `${DEFAULT_KEY_PREFIX}${key}`

        await Promise.all(this.stores.map(async store => {
            try {
                await store.set(key, value)
            } catch (err) {
                cl(err)
            }
        }))

        return value
    }

    async remove (key) {
        key = `${DEFAULT_KEY_PREFIX}${key}`

        await Promise.all(this.stores.map(async store => {
            try {
                await store.remove(key)
            } catch (err) {
                cl(err)
            }
        }))
    }
}


const IronDB = new IronStorage()


export {
    IronDB, IronStorage,
    CookieStore, IndexedDbStore, LocalStorageStore, SessionStorageStore,
    DEFAULT_STORES, DEFAULT_KEY_PREFIX }
