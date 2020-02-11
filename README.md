<h1>
  <div align="center">
    <img src="logo.png" width="260px" height="435px" alt="ImmortalDB">
  </div>

  ImmortalDB
</h1>


### ImmortalDB is a resilient key-value store for the browser.

ImmortalDB is the best way to store persistent key-value data in the
browser. Data saved to ImmortalDB is redundantly stored in
[Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies),
[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), and
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
and relentlessly self heals if any data therein is deleted or corrupted.

For example, clearing cookies is a common user action, even for non-technical
users. And browsers unceremoniously
[delete](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#LRU_policy)
IndexedDB, LocalStorage, and/or SessionStorage without warning under storage
pressure.

ImmortalDB is resilient in the face of such events.

In this way, ImmortalDB is like
[Evercookie](https://github.com/samyk/evercookie), but

  1. Is actively maintained and well documented.

  2. Provides a simple, modern, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based API.

  3. Strikes an equitable balance between reliability and respect for the
     user. Data is stored reliably but can also be voluntarily purged if the
     user designedly clears cookies and application storage.

  4. Doesn't use nefarious exploits nor deprecated third party plugins like
     Flash, Silverlight, or Java. Only standard, ratified HTML5 APIs are used.

  5. Doesn't vandalize performance or the user experience. For example,
     Evercookie's CSS History Knocking can beget a deluge of background HTTP
     requests, and loading Silverlight or Flash can raise unsought permission
     modals or thrash the user's disk.


### How ImmortalDB works.

When you store a key-value pair in ImmortalDB, that key and value are
saved redundantly in the browser's cookies, IndexedDB, and LocalStorage
data stores.

When a value is retrieved via its key, ImmortalDB

  1. Looks up that key in every data store.
  2. Counts each unique returned value.
  3. Determines the most commonly returned unique value as the 'correct' value.
  4. Returns this correct value.

Then ImmortalDB self-heals: if any data store(s) returned a value different than
the determined correct value, or no value at all, the correct value is rewritten
to that store. In this way, consensus, reliability, and redundancy is
maintained.


### API

#### Set

ImmortalDB's API is simple. To store a value, use `set(key, value)`:

```javascript
import { ImmortalDB } from 'immortal-db'

await ImmortalDB.set('key', 'value')
```

`key` and `value` must be
[DOMStrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString).
`ImmortalDB.set(key, value)` also always returns `value`, so it can be chained or
embedded, like

```javascript
const countPlusOne = (await ImmortalDB.set('count', numberOfClowns)) + 1
```

#### Get

To retrieve a value, use `get(key, default=null)`:

```javascript
const value = await ImmortalDB.get('key', default=null)
```

`get()` returns the value associated with `key`, if `key` exists. If `key`
doesn't exist, `default` is returned. `key` must be a
[DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString).

#### Remove

Finally, to remove a key, use `remove(key)`:

```javascript
ImmortalDB.set('hi', 'bonjour')
console.log(await ImmortalDB.get('hi'))  // Prints 'bonjour'.

await ImmortalDB.remove('hi')

console.log(await ImmortalDB.get('hi'))  // Prints 'null'.
```

`key` must be a
[DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString).

#### Data Stores

The data stores that ImmortalDB stores data in can also be configured. For
example, to only store data reliably in cookies and LocalStorage:

```javascript
import { ImmortalStorage, CookieStore, LocalStorageStore } from 'immortal-db'

const stores = [CookieStore, LocalStorageStore]
const db = new ImmortalStorage(stores)

await db.set(key, JSON.stringify({1:1}))
```

Stores used by `ImmortalDB` are:

  - `CookieStore` -> Keys and values are stored in `document.cookie`.
  - `IndexedDbStore` -> Keys and values are stored in `window.indexedDB`.
  - `LocalStorageStore` -> Keys and values are stored in `window.localStorage`.

Other, optional stores are:

  - `SessionStorageStore` -> Keys and values are stored in `window.sessionStorage`.

New storage implementations can easily be added, too; they need only implement
the methods `get(key, default)`, `set(key, value)`, and `remove(key)`.


### Installation

Installing ImmortalDB with npm is easy.

```
$ npm install immortal-db
```

Or include `dist/immortal-db[.min].js` and use `window.ImmortalDB` directly.

```html
<html>
  <head>
    <script src="immortal-db.min.js"></script>
    <script>
      ;(async () => {
        const db = ImmortalDB.ImmortalDB
        await db.set('hi', 'lolsup')
      })()
    </script>
  </head>

  ...
</html>
```


### Development

To test ImmortalDB, run

```
npm run start
```

This starts the [webpack](https://webpack.js.org/) dev server and opens
ImmortalDB's testing website,
[http://localhost:8080/](http://localhost:8080/).

Once tested, run

```
npm run build
```

to build production versions `immortal-db.js` and `immortal-db.min.js`
in `dist/`.