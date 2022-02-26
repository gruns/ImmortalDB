/**
 * Counts unique elements of an iterable.
 */
export function countUniques(iterable) {
    let nullishCount = 0;
    const counter = Object.create(null);
    iterable.forEach((el) => {
        if (el === undefined || el === null) {
            nullishCount += 1;
            return;
        }
        const amount = counter[el] || 0;
        counter[el] = amount + 1;
    });
    const result = Object.entries(counter);
    if (nullishCount) {
        result.push([undefined, nullishCount]);
    }
    return result;
}
