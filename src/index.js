//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

import { CookieStore } from './cookie-store';
import { ImmortalStorage } from './immortal-storage';
import { IndexedDbStore } from './indexed-db';
import { LocalStorageStore, SessionStorageStore } from './web-storage';
import { DEFAULT_KEY_PREFIX, DEFAULT_STORES } from './defaults';

const ImmortalDB = new ImmortalStorage();

export {
    ImmortalDB,
    ImmortalStorage,
    CookieStore,
    IndexedDbStore,
    LocalStorageStore,
    SessionStorageStore,
    DEFAULT_STORES,
    DEFAULT_KEY_PREFIX,
};
