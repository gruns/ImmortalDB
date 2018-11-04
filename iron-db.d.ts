//
// IronDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

// TypeScript type definitions for iron-db.

export const DEFAULT_STORES: CookieStore[];
export const DEFAULT_KEY_PREFIX: string;
export class CookieStore {
    constructor (ttl?:number);
    get (key:string): Promise<string>;
    set (key: string, value: string): Promise<void>;
    remove (key: string): Promise<void>;
}

export class IronStorage {
    constructor (stores?:CookieStore[]);

    get (key: string, _default?: string | null): Promise<string>;
    set (key: string, value: string): Promise<String>;
    remove(key: string): Promise<void>;
}

export const IronDB: IronStorage;
