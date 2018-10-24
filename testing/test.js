//
// IronDB - A resilient key-value storage library for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

const cl = console.log
const db = IronDB.IronDB
const idb = new idbKeyval.Store('IronDB', 'key-value-pairs')

const POLL_TIMEOUT = 300 // Milliseconds.
const PREFIX = IronDB.DEFAULT_KEY_PREFIX


function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


;(async () => {
    const ele = (id) => document.getElementById(id)

    const $key = ele('key')
    const $value = ele('value')

    ele('get').addEventListener(
        'click', async () => $value.value = await db.get($key.value), false)
    ele('set').addEventListener(
        'click', async () => await db.set($key.value, $value.value), false)
    ele('remove').addEventListener('click', async () => {
        await db.remove($key.value)
        $value.value = ''
    }, false)

    ele('removeCookie').addEventListener(
        'click', () => Cookies.remove(PREFIX + $key.value))
    ele('removeIndexedDB').addEventListener(
        'click', async () => await idbKeyval.del(PREFIX + $key.value, idb))
    ele('removeLocalStorage').addEventListener(
        'click', () => localStorage.removeItem(PREFIX + $key.value))
    ele('removeSessionStorage').addEventListener(
        'click', () => sessionStorage.removeItem(PREFIX + $key.value))

    ;(async function pollKeyLoop () {
        const $cookies = ele('cookies')
        const $indexedDB = ele('indexedDB')
        const $localStorage = ele('localStorage')
        const $sessionStorage = ele('sessionStorage')

        while (true) {
            const key = PREFIX + $key.value

            $cookies.value = Cookies.get(key)
            $indexedDB.value = await idbKeyval.get(key, idb)
            $localStorage.value = localStorage.getItem(key)
            $sessionStorage.value = sessionStorage.getItem(key)

            await sleep(POLL_TIMEOUT)
        }
    })()
})()
