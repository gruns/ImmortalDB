import { countUniques } from './helpers';
import {
    DEFAULT_KEY_PREFIX,
    DEFAULT_STORES,
    DEFAULT_VALUE,
} from './defaults';

const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

export class ImmortalStorage {
    constructor(
        stores = DEFAULT_STORES,
        keyPrefix = DEFAULT_KEY_PREFIX,
        defaultValue = DEFAULT_VALUE,
    ) {
        this.defaultValue = defaultValue;
        this.keyPrefix = keyPrefix;
        this.stores = [];
        this.onReady = (async () => {
            const results = await Promise.allSettled(stores.map((StoreClassOrInstance) => {
                if (typeof StoreClassOrInstance !== 'function') {
                    return StoreClassOrInstance;
                }
                try {
                    return new StoreClassOrInstance();
                } catch (error) {
                    return Promise.reject(error);
                }
            }));
            this.stores = results
                .filter((result) => result.status === FULFILLED)
                .map((result) => result.value)
                .filter((store) => store);
            if (this.stores.length === 0) {
                return Promise.reject(new Error('Unable to construct any store'));
            }
            return Promise.resolve();
        })();
    }

    prefix(value) {
        return `${this.keyPrefix}${value}`;
    }

    async get(key, _default = this.defaultValue) {
        await this.onReady;

        const prefixedKey = this.prefix(key);

        const results = await Promise.allSettled(
            this.stores.map((store) => store.get(prefixedKey)),
        );

        const values = results
            .filter((result) => result.status === FULFILLED)
            .map((result) => result.value);

        const counted = countUniques(values);
        counted.sort((a, b) => a[1] <= b[1]);

        const validated = counted
            .filter(([value]) => value !== undefined);

        if (validated.length === 0) {
            const rejections = results
                .filter((result) => result.status === REJECTED);

            if (rejections.length === 0) {
                await this.remove(key);
            }

            return _default;
        }

        const [value] = validated[0];

        try {
            await this.set(key, value);
        } catch (e) {}

        return value;
    }

    async set(key, value) {
        await this.onReady;

        const prefixedKey = this.prefix(key);

        const results = await Promise.allSettled(
            this.stores.map((store) => store.set(prefixedKey, value)),
        );

        const rejections = results
            .filter((result) => result.status === REJECTED);

        if (rejections.length > 0) {
            const all = this.stores.length === rejections.length;
            throw new Error(`${all ? 'All' : 'Some'} stores failed to set('${key}', '${value}')`);
        }

        return value;
    }

    async remove(key) {
        await this.onReady;

        const prefixedKey = this.prefix(key);

        const results = await Promise.allSettled(
            this.stores.map((store) => store.remove(prefixedKey)),
        );

        const rejections = results
            .filter((result) => result.status === REJECTED);

        if (rejections.length > 0) {
            const all = this.stores.length === rejections.length;
            throw new Error(`${all ? 'All' : 'Some'} stores failed to remove('${key}')`);
        }

        return this.defaultValue;
    }
}
