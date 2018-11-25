var ImmortalDB =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(0);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);

// CONCATENATED MODULE: ./src/cookie-store.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//



const DEFAULT_COOKIE_TTL = 365 // Days.

class cookie_store_CookieStore {
  constructor (ttl = DEFAULT_COOKIE_TTL) {
    this.ttl = ttl

    return (async () => this)()
  }

  async get (key) {
    const value = js_cookie_default.a.get(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    js_cookie_default.a.set(key, value, { expires: this.ttl })
  }

  async remove (key) {
    js_cookie_default.a.remove(key, { expires: this.ttl })
  }
}



// CONCATENATED MODULE: ./node_modules/idb-keyval/dist/idb-keyval.mjs
class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readonly', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readonly', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}



// CONCATENATED MODULE: ./src/indexed-db.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//



const DEFAULT_DATABASE_NAME = 'ImmortalDB'
const DEFAULT_STORE_NAME = 'key-value-pairs'

class indexed_db_IndexedDbStore {
  constructor (dbName = DEFAULT_DATABASE_NAME, storeName = DEFAULT_STORE_NAME) {
    this.store = new Store(dbName, storeName)

    return (async () => {
      // Safari throws a SecurityError if IndexedDB.open() is called in a
      // cross-origin iframe.
      //
      //   SecurityError: IDBFactory.open() called in an invalid security context
      //
      // Catch such and fail gracefully.
      //
      // TODO(grun): Update idb-keyval's Store class to fail gracefully in
      // Safari. Push the fix(es) upstream.
      try {
        await this.store._dbp
      } catch (err) {
        if (err.name === 'SecurityError') {
          return null // Failed to open an IndexedDB database.
        } else {
          throw err
        }
      }

      return this
    })()
  }

  async get (key) {
    const value = await get(key, this.store)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    await set(key, value, this.store)
  }

  async remove (key) {
    await del(key, this.store)
  }
}



// CONCATENATED MODULE: ./src/web-storage.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

class StorageApiWrapper {
  constructor (store) {
    this.store = store

    return (async () => this)()
  }

  async get (key) {
    const value = this.store.getItem(key)
    return typeof value === 'string' ? value : undefined
  }

  async set (key, value) {
    this.store.setItem(key, value)
  }

  async remove (key) {
    this.store.removeItem(key)
  }
}

class LocalStorageStore extends StorageApiWrapper {
  constructor () {
    super(window.localStorage)
  }
}

class SessionStorageStore extends StorageApiWrapper {
  constructor () {
    super(window.sessionStorage)
  }
}



// CONCATENATED MODULE: ./src/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImmortalDB", function() { return ImmortalDB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImmortalStorage", function() { return ImmortalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_STORES", function() { return DEFAULT_STORES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_KEY_PREFIX", function() { return DEFAULT_KEY_PREFIX; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CookieStore", function() { return cookie_store_CookieStore; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "IndexedDbStore", function() { return indexed_db_IndexedDbStore; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "LocalStorageStore", function() { return LocalStorageStore; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "SessionStorageStore", function() { return SessionStorageStore; });
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//





// Stores must implement asynchronous constructor, get(), set(), and remove()
// methods.
const DEFAULT_STORES = [cookie_store_CookieStore]
if (window.indexedDB) {
  DEFAULT_STORES.push(indexed_db_IndexedDbStore)
}
if (window.localStorage) {
  DEFAULT_STORES.push(LocalStorageStore)
}
if (window.sessionStorage) {
  DEFAULT_STORES.push(SessionStorageStore)
}

const cl = console.log
const DEFAULT_KEY_PREFIX = '_immortal|'

function arrget (arr, index, _default = null) {
    if (index in arr) {
        return arr[index]
    }
    return _default
}

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

class ImmortalStorage {
  constructor (stores = DEFAULT_STORES) {
    this.stores = []

    // Initialize stores asynchronously.
    this.onReady = (async () => {
      this.stores = (await Promise.all(stores.map(async Store => {
        try {
          return await new Store()
        } catch (err) {
          // TODO(grun): Log (where?) that the <Store> constructor failed.
          return null
        }
      }))).filter(Boolean)
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

    const counted = Array.from(countUniques(values).entries())
    counted.sort((a, b) => a[1] <= b[1])

    let value
    const [firstValue, firstCount] = arrget(counted, 0, [undefined, 0])
    const [secondValue, secondCount] = arrget(counted, 1, [undefined, 0])
    if (firstCount > secondCount ||
        (firstCount === secondCount && firstValue !== undefined)) {
      value = firstValue
    } else {
      value = secondValue
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
    await this.onReady

    key = `${DEFAULT_KEY_PREFIX}${key}`

    await Promise.all(
      this.stores.map(async store => {
        try {
          await store.set(key, value)
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




/***/ })
/******/ ]);