import { countUniques } from './helpers';
import {
    DEFAULT_KEY_PREFIX,
    DEFAULT_STORES,
} from './defaults';

const cl = console.log;

function arrayGet(arr, index, _default = null) {
    if (index in arr) {
        return arr[index];
    }
    return _default;
}

export class ImmortalStorage {
    constructor(stores = DEFAULT_STORES) {
        this.stores = [];

        // Initialize stores asynchronously. Accept both instantiated store
        // objects and uninstantiated store classes. If the latter,
        // implicitly instantiate instances thereof in this constructor.
        //
        // This constructor must accept both instantiated store objects and
        // uninstantiated store classes because it's impossible to export
        // ImmortalStore if it only took store objects initialized
        // asynchronously. Like:
        //
        //   ;(async () => {
        //       const cookieStore = await CookieStore()
        //       const ImmortalDB = new ImmortalStorage([cookieStore])
        //       export { ImmortalDB }  // <----- Doesn't work.
        //   })
        //
        // So to export a synchronous ImmortalStorage class, datastore
        // classes (whose definitions are synchronous) must be accepted in
        // addition to instantiated store objects.
        this.onReady = (async () => {
            this.stores = (await Promise.all(
                stores.map(async (StoreClassOrInstance) => {
                    if (typeof StoreClassOrInstance === 'object') { // Store instance.
                        return StoreClassOrInstance;
                    } // Store class.
                    try {
                        return await new StoreClassOrInstance(); // Instantiate instance.
                    } catch (err) {
                        // TODO(grun): Log (where?) that the <Store> constructor Promise
                        // failed.
                        return null;
                    }
                }),
            )).filter(Boolean);
        })();
    }

    async get(key, _default = null) {
        await this.onReady;

        const prefixedKey = `${DEFAULT_KEY_PREFIX}${key}`;

        const values = await Promise.all(
            this.stores.map(async (store) => {
                try {
                    return await store.get(prefixedKey);
                } catch (err) {
                    cl(err);
                }
            }),
        );

        const counted = countUniques(values);
        counted.sort((a, b) => a[1] <= b[1]);

        let value;
        const [firstValue, firstCount] = arrayGet(counted, 0, [undefined, 0]);
        const [secondValue, secondCount] = arrayGet(counted, 1, [undefined, 0]);
        if (
            firstCount > secondCount
      || (firstCount === secondCount && firstValue !== undefined)
        ) {
            value = firstValue;
        } else {
            value = secondValue;
        }

        if (value !== undefined) {
            await this.set(key, value);
            return value;
        }
        await this.remove(key);
        return _default;
    }

    async set(key, value) {
        await this.onReady;

        key = `${DEFAULT_KEY_PREFIX}${key}`;

        await Promise.all(
            this.stores.map(async (store) => {
                try {
                    await store.set(key, value);
                } catch (err) {
                    cl(err);
                }
            }),
        );

        return value;
    }

    async remove(key) {
        await this.onReady;

        key = `${DEFAULT_KEY_PREFIX}${key}`;

        await Promise.all(
            this.stores.map(async (store) => {
                try {
                    await store.remove(key);
                } catch (err) {
                    cl(err);
                }
            }),
        );
    }
}
