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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/idb-keyval/dist/idb-keyval.mjs":
/*!*****************************************************!*\
  !*** ./node_modules/idb-keyval/dist/idb-keyval.mjs ***!
  \*****************************************************/
/*! exports provided: Store, get, set, del, clear, keys */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Store\", function() { return Store; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"get\", function() { return get; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"set\", function() { return set; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"del\", function() { return del; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"clear\", function() { return clear; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"keys\", function() { return keys; });\nclass Store {\r\n    constructor(dbName = 'keyval-store', storeName = 'keyval') {\r\n        this.storeName = storeName;\r\n        this._dbp = new Promise((resolve, reject) => {\r\n            const openreq = indexedDB.open(dbName, 1);\r\n            openreq.onerror = () => reject(openreq.error);\r\n            openreq.onsuccess = () => resolve(openreq.result);\r\n            // First time setup: create an empty object store\r\n            openreq.onupgradeneeded = () => {\r\n                openreq.result.createObjectStore(storeName);\r\n            };\r\n        });\r\n    }\r\n    _withIDBStore(type, callback) {\r\n        return this._dbp.then(db => new Promise((resolve, reject) => {\r\n            const transaction = db.transaction(this.storeName, type);\r\n            transaction.oncomplete = () => resolve();\r\n            transaction.onabort = transaction.onerror = () => reject(transaction.error);\r\n            callback(transaction.objectStore(this.storeName));\r\n        }));\r\n    }\r\n}\r\nlet store;\r\nfunction getDefaultStore() {\r\n    if (!store)\r\n        store = new Store();\r\n    return store;\r\n}\r\nfunction get(key, store = getDefaultStore()) {\r\n    let req;\r\n    return store._withIDBStore('readonly', store => {\r\n        req = store.get(key);\r\n    }).then(() => req.result);\r\n}\r\nfunction set(key, value, store = getDefaultStore()) {\r\n    return store._withIDBStore('readwrite', store => {\r\n        store.put(value, key);\r\n    });\r\n}\r\nfunction del(key, store = getDefaultStore()) {\r\n    return store._withIDBStore('readwrite', store => {\r\n        store.delete(key);\r\n    });\r\n}\r\nfunction clear(store = getDefaultStore()) {\r\n    return store._withIDBStore('readwrite', store => {\r\n        store.clear();\r\n    });\r\n}\r\nfunction keys(store = getDefaultStore()) {\r\n    const keys = [];\r\n    return store._withIDBStore('readonly', store => {\r\n        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.\r\n        // And openKeyCursor isn't supported by Safari.\r\n        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {\r\n            if (!this.result)\r\n                return;\r\n            keys.push(this.result.key);\r\n            this.result.continue();\r\n        };\r\n    }).then(() => keys);\r\n}\n\n\n\n\n//# sourceURL=webpack://ImmortalDB/./node_modules/idb-keyval/dist/idb-keyval.mjs?");

/***/ }),

/***/ "./node_modules/js-cookie/src/js.cookie.js":
/*!*************************************************!*\
  !*** ./node_modules/js-cookie/src/js.cookie.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!\n * JavaScript Cookie v2.2.0\n * https://github.com/js-cookie/js-cookie\n *\n * Copyright 2006, 2015 Klaus Hartl & Fagner Brack\n * Released under the MIT license\n */\n;(function (factory) {\n\tvar registeredInModuleLoader = false;\n\tif (true) {\n\t\t!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t\tregisteredInModuleLoader = true;\n\t}\n\tif (true) {\n\t\tmodule.exports = factory();\n\t\tregisteredInModuleLoader = true;\n\t}\n\tif (!registeredInModuleLoader) {\n\t\tvar OldCookies = window.Cookies;\n\t\tvar api = window.Cookies = factory();\n\t\tapi.noConflict = function () {\n\t\t\twindow.Cookies = OldCookies;\n\t\t\treturn api;\n\t\t};\n\t}\n}(function () {\n\tfunction extend () {\n\t\tvar i = 0;\n\t\tvar result = {};\n\t\tfor (; i < arguments.length; i++) {\n\t\t\tvar attributes = arguments[ i ];\n\t\t\tfor (var key in attributes) {\n\t\t\t\tresult[key] = attributes[key];\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t}\n\n\tfunction init (converter) {\n\t\tfunction api (key, value, attributes) {\n\t\t\tvar result;\n\t\t\tif (typeof document === 'undefined') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Write\n\n\t\t\tif (arguments.length > 1) {\n\t\t\t\tattributes = extend({\n\t\t\t\t\tpath: '/'\n\t\t\t\t}, api.defaults, attributes);\n\n\t\t\t\tif (typeof attributes.expires === 'number') {\n\t\t\t\t\tvar expires = new Date();\n\t\t\t\t\texpires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);\n\t\t\t\t\tattributes.expires = expires;\n\t\t\t\t}\n\n\t\t\t\t// We're using \"expires\" because \"max-age\" is not supported by IE\n\t\t\t\tattributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';\n\n\t\t\t\ttry {\n\t\t\t\t\tresult = JSON.stringify(value);\n\t\t\t\t\tif (/^[\\{\\[]/.test(result)) {\n\t\t\t\t\t\tvalue = result;\n\t\t\t\t\t}\n\t\t\t\t} catch (e) {}\n\n\t\t\t\tif (!converter.write) {\n\t\t\t\t\tvalue = encodeURIComponent(String(value))\n\t\t\t\t\t\t.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);\n\t\t\t\t} else {\n\t\t\t\t\tvalue = converter.write(value, key);\n\t\t\t\t}\n\n\t\t\t\tkey = encodeURIComponent(String(key));\n\t\t\t\tkey = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);\n\t\t\t\tkey = key.replace(/[\\(\\)]/g, escape);\n\n\t\t\t\tvar stringifiedAttributes = '';\n\n\t\t\t\tfor (var attributeName in attributes) {\n\t\t\t\t\tif (!attributes[attributeName]) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tstringifiedAttributes += '; ' + attributeName;\n\t\t\t\t\tif (attributes[attributeName] === true) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tstringifiedAttributes += '=' + attributes[attributeName];\n\t\t\t\t}\n\t\t\t\treturn (document.cookie = key + '=' + value + stringifiedAttributes);\n\t\t\t}\n\n\t\t\t// Read\n\n\t\t\tif (!key) {\n\t\t\t\tresult = {};\n\t\t\t}\n\n\t\t\t// To prevent the for loop in the first place assign an empty array\n\t\t\t// in case there are no cookies at all. Also prevents odd result when\n\t\t\t// calling \"get()\"\n\t\t\tvar cookies = document.cookie ? document.cookie.split('; ') : [];\n\t\t\tvar rdecode = /(%[0-9A-Z]{2})+/g;\n\t\t\tvar i = 0;\n\n\t\t\tfor (; i < cookies.length; i++) {\n\t\t\t\tvar parts = cookies[i].split('=');\n\t\t\t\tvar cookie = parts.slice(1).join('=');\n\n\t\t\t\tif (!this.json && cookie.charAt(0) === '\"') {\n\t\t\t\t\tcookie = cookie.slice(1, -1);\n\t\t\t\t}\n\n\t\t\t\ttry {\n\t\t\t\t\tvar name = parts[0].replace(rdecode, decodeURIComponent);\n\t\t\t\t\tcookie = converter.read ?\n\t\t\t\t\t\tconverter.read(cookie, name) : converter(cookie, name) ||\n\t\t\t\t\t\tcookie.replace(rdecode, decodeURIComponent);\n\n\t\t\t\t\tif (this.json) {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tcookie = JSON.parse(cookie);\n\t\t\t\t\t\t} catch (e) {}\n\t\t\t\t\t}\n\n\t\t\t\t\tif (key === name) {\n\t\t\t\t\t\tresult = cookie;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\tif (!key) {\n\t\t\t\t\t\tresult[name] = cookie;\n\t\t\t\t\t}\n\t\t\t\t} catch (e) {}\n\t\t\t}\n\n\t\t\treturn result;\n\t\t}\n\n\t\tapi.set = api;\n\t\tapi.get = function (key) {\n\t\t\treturn api.call(api, key);\n\t\t};\n\t\tapi.getJSON = function () {\n\t\t\treturn api.apply({\n\t\t\t\tjson: true\n\t\t\t}, [].slice.call(arguments));\n\t\t};\n\t\tapi.defaults = {};\n\n\t\tapi.remove = function (key, attributes) {\n\t\t\tapi(key, '', extend(attributes, {\n\t\t\t\texpires: -1\n\t\t\t}));\n\t\t};\n\n\t\tapi.withConverter = init;\n\n\t\treturn api;\n\t}\n\n\treturn init(function () {});\n}));\n\n\n//# sourceURL=webpack://ImmortalDB/./node_modules/js-cookie/src/js.cookie.js?");

/***/ }),

/***/ "./src/cookie-store.js":
/*!*****************************!*\
  !*** ./src/cookie-store.js ***!
  \*****************************/
/*! exports provided: CookieStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CookieStore\", function() { return CookieStore; });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);\n//\n// ImmortalDB - A resilient key-value store for browsers.\n//\n// Ansgar Grunseid\n// grunseid.com\n// grunseid@gmail.com\n//\n// License: MIT\n//\n\n\n\nconst DEFAULT_COOKIE_TTL = 365 // Days.\n\nclass CookieStore {\n  constructor (ttl = DEFAULT_COOKIE_TTL) {\n    this.ttl = ttl\n\n    return (async () => this)()\n  }\n\n  async get (key) {\n    const value = js_cookie__WEBPACK_IMPORTED_MODULE_0___default.a.get(key)\n    return typeof value === 'string' ? value : undefined\n  }\n\n  async set (key, value) {\n    js_cookie__WEBPACK_IMPORTED_MODULE_0___default.a.set(key, value, { expires: this.ttl })\n  }\n\n  async remove (key) {\n    js_cookie__WEBPACK_IMPORTED_MODULE_0___default.a.remove(key, { expires: this.ttl })\n  }\n}\n\n\n\n\n//# sourceURL=webpack://ImmortalDB/./src/cookie-store.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: ImmortalDB, ImmortalStorage, CookieStore, IndexedDbStore, LocalStorageStore, SessionStorageStore, DEFAULT_STORES, DEFAULT_KEY_PREFIX */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ImmortalDB\", function() { return ImmortalDB; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ImmortalStorage\", function() { return ImmortalStorage; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DEFAULT_STORES\", function() { return DEFAULT_STORES; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DEFAULT_KEY_PREFIX\", function() { return DEFAULT_KEY_PREFIX; });\n/* harmony import */ var _cookie_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cookie-store */ \"./src/cookie-store.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"CookieStore\", function() { return _cookie_store__WEBPACK_IMPORTED_MODULE_0__[\"CookieStore\"]; });\n\n/* harmony import */ var _indexed_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./indexed-db */ \"./src/indexed-db.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"IndexedDbStore\", function() { return _indexed_db__WEBPACK_IMPORTED_MODULE_1__[\"IndexedDbStore\"]; });\n\n/* harmony import */ var _web_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./web-storage */ \"./src/web-storage.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"LocalStorageStore\", function() { return _web_storage__WEBPACK_IMPORTED_MODULE_2__[\"LocalStorageStore\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SessionStorageStore\", function() { return _web_storage__WEBPACK_IMPORTED_MODULE_2__[\"SessionStorageStore\"]; });\n\n//\n// ImmortalDB - A resilient key-value store for browsers.\n//\n// Ansgar Grunseid\n// grunseid.com\n// grunseid@gmail.com\n//\n// License: MIT\n//\n\n\n\n\n\n// Stores must implement asynchronous constructor, get(), set(), and remove()\n// methods.\nconst DEFAULT_STORES = [_cookie_store__WEBPACK_IMPORTED_MODULE_0__[\"CookieStore\"]]\nif (window.indexedDB) {\n  DEFAULT_STORES.push(_indexed_db__WEBPACK_IMPORTED_MODULE_1__[\"IndexedDbStore\"])\n}\nif (window.localStorage) {\n  DEFAULT_STORES.push(_web_storage__WEBPACK_IMPORTED_MODULE_2__[\"LocalStorageStore\"])\n}\nif (window.sessionStorage) {\n  DEFAULT_STORES.push(_web_storage__WEBPACK_IMPORTED_MODULE_2__[\"SessionStorageStore\"])\n}\n\nconst cl = console.log\nconst DEFAULT_KEY_PREFIX = '_immortal|'\n\nfunction arrget (arr, index, _default = null) {\n    if (index in arr) {\n        return arr[index]\n    }\n    return _default\n}\n\nfunction countUniques (iterable) {\n  // A Map must be used instead of an Object because JavaScript is a buttshit\n  // language and all Object keys are serialized to strings. Thus undefined\n  // becomes 'undefined', null becomes 'null', etc and in turn null can't be\n  // differentiated from 'null', 'undefined' from undefined, etc. E.g.\n  // countUniques([null, 'null']) would incorrectly return {'null': 2} instead\n  // of the correct {null: 1, 'null': 1}.\n  //\n  // Unfortunately this Object behavior precludes the use of lodash.countBy()\n  // and similar methods which count with Objects instead of Maps.\n  const m = new Map()\n  let eles = iterable.slice()\n\n  for (const ele of eles) {\n    let count = 0\n    for (const obj of eles) {\n      if (ele === obj) {\n        count += 1\n      }\n    }\n\n    if (count > 0) {\n      m.set(ele, count)\n      eles = eles.filter(obj => obj !== ele)\n    }\n  }\n\n  return m\n}\n\nclass ImmortalStorage {\n  constructor (stores = DEFAULT_STORES) {\n    this.stores = []\n\n    // Initialize stores asynchronously.\n    this.onReady = (async () => {\n      this.stores = (await Promise.all(stores.map(async Store => {\n        try {\n          return await new Store()\n        } catch (err) {\n          // TODO(grun): Log (where?) that the <Store> constructor failed.\n          return null\n        }\n      }))).filter(Boolean)\n    })()\n  }\n\n  async get (key, _default = null) {\n    await this.onReady\n\n    const prefixedKey = `${DEFAULT_KEY_PREFIX}${key}`\n\n    const values = await Promise.all(\n      this.stores.map(async store => {\n        try {\n          return await store.get(prefixedKey)\n        } catch (err) {\n          cl(err)\n        }\n      }),\n    )\n\n    const counted = Array.from(countUniques(values).entries())\n    counted.sort((a, b) => a[1] <= b[1])\n\n    let value\n    const [firstValue, firstCount] = arrget(counted, 0, [undefined, 0])\n    const [secondValue, secondCount] = arrget(counted, 1, [undefined, 0])\n    if (firstCount > secondCount ||\n        (firstCount === secondCount && firstValue !== undefined)) {\n      value = firstValue\n    } else {\n      value = secondValue\n    }\n\n    if (value !== undefined) {\n      await this.set(key, value)\n      return value\n    } else {\n      await this.remove(key)\n      return _default\n    }\n  }\n\n  async set (key, value) {\n    await this.onReady\n\n    key = `${DEFAULT_KEY_PREFIX}${key}`\n\n    await Promise.all(\n      this.stores.map(async store => {\n        try {\n          await store.set(key, value)\n        } catch (err) {\n          cl(err)\n        }\n      }),\n    )\n\n    return value\n  }\n\n  async remove (key) {\n    await this.onReady\n\n    key = `${DEFAULT_KEY_PREFIX}${key}`\n\n    await Promise.all(\n      this.stores.map(async store => {\n        try {\n          await store.remove(key)\n        } catch (err) {\n          cl(err)\n        }\n      }),\n    )\n  }\n}\n\nconst ImmortalDB = new ImmortalStorage()\n\n\n\n\n//# sourceURL=webpack://ImmortalDB/./src/index.js?");

/***/ }),

/***/ "./src/indexed-db.js":
/*!***************************!*\
  !*** ./src/indexed-db.js ***!
  \***************************/
/*! exports provided: IndexedDbStore, DEFAULT_DATABASE_NAME, DEFAULT_STORE_NAME */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IndexedDbStore\", function() { return IndexedDbStore; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DEFAULT_DATABASE_NAME\", function() { return DEFAULT_DATABASE_NAME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DEFAULT_STORE_NAME\", function() { return DEFAULT_STORE_NAME; });\n/* harmony import */ var idb_keyval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb-keyval */ \"./node_modules/idb-keyval/dist/idb-keyval.mjs\");\n//\n// ImmortalDB - A resilient key-value store for browsers.\n//\n// Ansgar Grunseid\n// grunseid.com\n// grunseid@gmail.com\n//\n// License: MIT\n//\n\n\n\nconst DEFAULT_DATABASE_NAME = 'ImmortalDB'\nconst DEFAULT_STORE_NAME = 'key-value-pairs'\n\nclass IndexedDbStore {\n  constructor (dbName = DEFAULT_DATABASE_NAME, storeName = DEFAULT_STORE_NAME) {\n    this.store = new idb_keyval__WEBPACK_IMPORTED_MODULE_0__[\"Store\"](dbName, storeName)\n\n    return (async () => {\n      // Safari throws a SecurityError if IndexedDB.open() is called in a\n      // cross-origin iframe.\n      //\n      //   SecurityError: IDBFactory.open() called in an invalid security context\n      //\n      // Catch such and fail gracefully.\n      //\n      // TODO(grun): Update idb-keyval's Store class to fail gracefully in\n      // Safari. Push the fix(es) upstream.\n      try {\n        await this.store._dbp\n      } catch (err) {\n        if (err.name === 'SecurityError') {\n          return null // Failed to open an IndexedDB database.\n        } else {\n          throw err\n        }\n      }\n\n      return this\n    })()\n  }\n\n  async get (key) {\n    const value = await Object(idb_keyval__WEBPACK_IMPORTED_MODULE_0__[\"get\"])(key, this.store)\n    return typeof value === 'string' ? value : undefined\n  }\n\n  async set (key, value) {\n    await Object(idb_keyval__WEBPACK_IMPORTED_MODULE_0__[\"set\"])(key, value, this.store)\n  }\n\n  async remove (key) {\n    await Object(idb_keyval__WEBPACK_IMPORTED_MODULE_0__[\"del\"])(key, this.store)\n  }\n}\n\n\n\n\n//# sourceURL=webpack://ImmortalDB/./src/indexed-db.js?");

/***/ }),

/***/ "./src/web-storage.js":
/*!****************************!*\
  !*** ./src/web-storage.js ***!
  \****************************/
/*! exports provided: LocalStorageStore, SessionStorageStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LocalStorageStore\", function() { return LocalStorageStore; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SessionStorageStore\", function() { return SessionStorageStore; });\n//\n// ImmortalDB - A resilient key-value store for browsers.\n//\n// Ansgar Grunseid\n// grunseid.com\n// grunseid@gmail.com\n//\n// License: MIT\n//\n\nclass StorageApiWrapper {\n  constructor (store) {\n    this.store = store\n\n    return (async () => this)()\n  }\n\n  async get (key) {\n    const value = this.store.getItem(key)\n    return typeof value === 'string' ? value : undefined\n  }\n\n  async set (key, value) {\n    this.store.setItem(key, value)\n  }\n\n  async remove (key) {\n    this.store.removeItem(key)\n  }\n}\n\nclass LocalStorageStore extends StorageApiWrapper {\n  constructor () {\n    super(window.localStorage)\n  }\n}\n\nclass SessionStorageStore extends StorageApiWrapper {\n  constructor () {\n    super(window.sessionStorage)\n  }\n}\n\n\n\n\n//# sourceURL=webpack://ImmortalDB/./src/web-storage.js?");

/***/ })

/******/ });