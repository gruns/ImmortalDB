//type definitions for iron-db

export interface Store {
    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}

export const DEFAULT_STORES: Store[];
export const DEFAULT_KEY_PREFIX: string;
export class CookieStore implements Store {
    constructor(ttl?: number);

    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
export class IndexedDbStore implements Store {
    constructor(dbName?: string, storeName?: string);

    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
class StorageApiWrapper implements Store {
    constructor(store: Storage);

    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
export class LocalStorageStore implements StorageApiWrapper {}
export class SessionStorageStore implements StorageApiWrapper {}

export class IronStorage {
    constructor(stores?: Store[]);

    get(key: string, _default?: null): Promise<string | null>;
    get(key: string, _default: string): Promise<string>;
    set(key: string, value: string): Promise<string>;
    remove(key: string): Promise<void>;
}

export const IronDB: IronStorage;
