import { countUniques } from './helpers';

describe('countUniques', () => {
    test('should throw when invoked with no params', () => {
        expect(countUniques).toThrow();
    });
    test('should return an array of entries with the count', () => {
        const values = ['foo', 'bar', 'bar', 'baz', 'bar'];
        const counted = countUniques(values);
        expect(counted).toHaveLength(3);
        expect(counted).toEqual(expect.arrayContaining([
            ['foo', 1],
            ['bar', 3],
            ['baz', 1],
        ]));
    });
    test('should tell appart nullish values', () => {
        const values = ['null', 'undefined', null, undefined, undefined];
        const counted = countUniques(values);
        expect(counted).toHaveLength(3);
        expect(counted).toEqual(expect.arrayContaining([
            [undefined, 3],
            ['undefined', 1],
            ['null', 1],
        ]));
    });
});
