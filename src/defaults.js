import { CookieStore } from './cookie-store';
import { IndexedDbStore } from './indexed-db';
import { LocalStorageStore } from './web-storage';
import { getGlobal } from './helpers';

export const DEFAULT_VALUE = undefined;
export const DEFAULT_KEY_PREFIX = '_immortal|';
export const DEFAULT_STORES = [CookieStore];

const window = getGlobal();

try {
    if (window && window.indexedDB) {
        DEFAULT_STORES.push(IndexedDbStore);
    }
} catch (err) {}

try {
    if (window && window.localStorage) {
        DEFAULT_STORES.push(LocalStorageStore);
    }
} catch (err) {}
