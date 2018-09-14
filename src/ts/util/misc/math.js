"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = function (a) {
    let sum = 0;
    for (const n of a) {
        sum += n;
    }
    return sum;
};
exports.sumBy = function (a, by) {
    let sum = 0;
    for (const n of a) {
        sum += by(n);
    }
    return sum;
};
const checkNonEmpty = function (a, name) {
    if (a.length === 0) {
        throw new Error(`${name} does not exist b/c 0 elements in array`);
    }
};
exports.min = function (a) {
    checkNonEmpty(a, "min");
    let min = a[0];
    for (let i = 1; i < a.length; i++) {
        const n = a[i];
        if (n < min) {
            min = n;
        }
    }
    return min;
};
exports.max = function (a) {
    checkNonEmpty(a, "max");
    let max = a[0];
    for (let i = 1; i < a.length; i++) {
        const n = a[i];
        if (n > max) {
            max = n;
        }
    }
    return max;
};
exports.range = function (a) {
    checkNonEmpty(a, "range");
    let min = a[0];
    let max = min;
    for (let i = 1; i < a.length; i++) {
        const n = a[i];
        if (n < min) {
            min = n;
        }
        else if (n > max) {
            max = n;
        }
    }
    return [min, max];
};
//# sourceMappingURL=math.js.map