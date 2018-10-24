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
    del as idbRemove
} from 'idb-keyval'


const DEFAULT_DATABASE_NAME = 'IronDB'
const DEFAULT_STORE_NAME = 'key-value-pairs'


class IndexedDbStore {
    constructor (dbName=DEFAULT_DATABASE_NAME, storeName=DEFAULT_STORE_NAME) {
        this.store = new Store(dbName, storeName)
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
