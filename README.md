<h1>
  <div align="center">
    <img src="logo.png" width="260px" height="435px" alt="IronDB">
  </div>

  IronDB
</h1>


### IronDB is a resilient key-value store for the browser.

IronDB is the best way to store persistent key-value data in the browser. Data
saved to IronDB is redundantly saved to multiple browser stores

  * Cookies
  * IndexedDB
  * LocalStorage
  * SessionStorage

and relentlessly self heals if any of those stores are deleted or corrupted. In
this way, IronDB is like [Evercookie](https://github.com/samyk/evercookie) but

  1. Is actively maintained and well documented.

  2. Provides a simple, modern, Promise-based API.

  3. Strikes an equitable balance between reliability and respect for the
     user. Data is stored resiliently but can also be voluntarily purged if the
     user designedly clears cookies and application storage.

  4. Doesn't use nefarious exploits nor deprecated third party plugins like
     Flash, Silverlight, or Java. Only standard, ratified HTML5 APIs are used.

  5. Doesn't vandalize performance or the user experience. For example,
     Evercookie's CSS History Knocking can beget a deluge of background HTTP
     requests, and loading Silverlight or Flash can thrash the user's disk or
     raise unsought permission modals.


### How IronDB works

When you store a key-value pair in IronDB, that key and value are saved
redundantly in the browser's cookie, IndexedDB, LocalStorage, and SessionStorage
storage engines.

When a value is retrieved via its key, IronDB

  1. Looks up that key in every store.
  2. Counts each unique, returned value.
  3. Determines the most commonly returned value as the 'correct' value.
  4. Returns this most common correct value

Then IronDB self heals: if any store(s) returned a value different than the
determined correct value, or no value at all, the correct value is rewritten to
that store. In this way, consensus, reliability, and redundancy is maintained.


### API

IronDB's API is simple. To store a value, use `set(key, value)`:

```javascript
import { IronDB } from 'iron-db'

await IronDB.set('key', 'value')
```

`key` and `value` must be
[DOMStrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString).
`IronDB.set(key, value)` also always returns `value`, so it can be chained or
embedded, like

```javascript
const count = (await IronDB.set('count', countNumberOfClowns())) + 1
```

To retrieve a value, use `get(key, default=null)`:

```javascript
const value = await IronDB.get('key', default=null)
```

`get()` returns the value associated with `key`, if `key` exists. If `key`
doesn't exist, `default` is returned. `key` must be a
[DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString).

Finally, to remove a key, use `remove(key)`:

```javascript
IronDB.set('hi', 'bonjour')
console.log(await IronDB.get('hi'))  // Prints 'bonjour'.

await IronDB.remove('hi')

console.log(await IronDB.get('hi')) // Prints 'null'.
```

`key` must be a
[DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString).

The storage engines that IronDB stores data in can also be configured. For
example, to only store data reliably in browser cookies and localStorage:

```javascript
import { IronStorage, CookieStore, LocalStorageStore } from 'iron-db'

const stores = [new CookieStore(), new LocalStorageStore()]
const db = IronStorage(stores)

await db.set('key', JSON.Stringify({1:1}))
```

Available stores are

  - CookieStore -> Data stored in `document.cookie`.
  - IndexedDbStore -> Data stored in `window.indexedDB`.
  - LocalStorageStore -> Data stored in `window.localStorage`.
  - SessionStorageStore -> Data stored in `window.sessionStorage`.

Adding other additional, custom stores is easy, too: new stores need only
implement the `get(key)`, `set(key, value)`, and `remove(key)` methods.


### Installation

Installing IronDB with npm is easy.

```
$ npm install iron-db
```
