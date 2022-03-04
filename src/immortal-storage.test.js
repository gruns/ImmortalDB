import { ImmortalStorage } from './immortal-storage';

const badStoreFactory = (msg) => ['get', 'set', 'remove'].reduce((store, method) => ({ ...store, [method]: () => Promise.reject(new Error(msg)) }), {});
const goodStoreFactory = (msg) => ['get', 'set', 'remove'].reduce((store, method) => ({ ...store, [method]: () => Promise.resolve(msg) }), {});

function toAsyncConstructor(storeOrError, timeout = 0) {
    return function AsyncConstructor() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (storeOrError instanceof Error) {
                    reject(storeOrError);
                } else {
                    resolve(storeOrError);
                }
            }, timeout);
        });
    };
}

const key = 'any';
const correctValue = 'ok';
const errorMessage = 'Boom';

describe('get()', () => {
    test('should return the correct common value, and reset', async () => {
        const rogueValue = 'foo';
        const disidentStore = goodStoreFactory(rogueValue);
        const disidentStoreSet = jest.spyOn(disidentStore, 'set');
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
            disidentStore,
        ]);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
        expect(disidentStoreSet).toBeCalledWith(immortal.prefix(key), correctValue);
    });
    test('should return the correct common value without accounting on amount of nullish', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(undefined),
            goodStoreFactory(undefined),
            goodStoreFactory(null),
        ]);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
    });
    test('should return the correct common value, even is some store fails', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(undefined),
            goodStoreFactory(undefined),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
    });
    test('should not remove() when some store has rejected', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(null),
            goodStoreFactory(undefined),
            goodStoreFactory(undefined),
            badStoreFactory('Error'),
        ]);
        const spy = jest.spyOn(immortal, 'remove');
        await expect(immortal.get(key, 'foo')).resolves.toBe('foo');
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('set()', () => {
    test('should resolve to the set value when everything went alright', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ]);
        await expect(immortal.set(key, correctValue)).resolves.toBe(correctValue);
    });
    test('should reject with reason "Some..." when an store fails', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            badStoreFactory(correctValue),
        ]);
        await expect(immortal.set(key, correctValue)).rejects.toThrow('Some');
    });
    test('should reject with reason "All..." when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            badStoreFactory(correctValue),
            badStoreFactory(correctValue),
        ]);
        await expect(immortal.set(key, correctValue)).rejects.toThrow('All');
    });
});

describe('remove()', () => {
    test('should resolve when everything went alright', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ]);
        await expect(immortal.remove(key)).resolves.toBe(immortal.defaultValue);
    });
    test('should reject with reason "Some..." when an store fails', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.remove(key)).rejects.toThrow('Some');
    });
    test('should reject with reason "All..." when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            badStoreFactory(correctValue),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.remove(key)).rejects.toThrow('All');
    });
});

describe('constructor', () => {
    test('should have filled the stores array when the onReady promise resolves', async () => {
        const stores = [
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ];
        const immortal = new ImmortalStorage(
            stores.map(toAsyncConstructor),
        );
        expect(immortal.stores).toHaveLength(0);
        await immortal.onReady;
        expect(immortal.stores).toEqual(expect.arrayContaining(stores));
    });
    test('should construct with store classes and instances mixed', async () => {
        const stores = [
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ];
        const immortal = new ImmortalStorage([
            toAsyncConstructor(stores[0]),
            stores[1],
        ]);
        await immortal.onReady;
        expect(immortal.stores).toEqual(expect.arrayContaining(stores));
    });
    test('should construct even if some store fails', async () => {
        const stores = [
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ];
        const immortal = new ImmortalStorage([
            ...stores.map(toAsyncConstructor),
            toAsyncConstructor(new Error(errorMessage)),
        ]);
        await immortal.onReady;
        expect(immortal.stores).toEqual(expect.arrayContaining(stores));
    });
    test('should reject when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            toAsyncConstructor(new Error(errorMessage)),
            toAsyncConstructor(new Error(errorMessage)),
            undefined,
        ]);
        await expect(immortal.onReady).rejects.toThrow('Unable');
        expect(immortal.stores).toHaveLength(0);
    });
});
