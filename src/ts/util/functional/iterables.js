"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isType_1 = require("../types/isType");
var iterables;
(function (iterables) {
    iterables.ofGenerator = function (generator) {
        return {
            [Symbol.iterator]: generator,
        };
    };
    iterables.ofIterator = function (iterator) {
        return iterables.ofGenerator(() => iterator);
    };
    iterables.map = function (iterable, map) {
        if (isType_1.isArray(iterable)) {
            return iterable.map(map);
        }
        return iterables.ofGenerator(function* () {
            let i = 0;
            for (const e of iterable) {
                yield map(e, i++);
            }
        });
    };
})(iterables = exports.iterables || (exports.iterables = {}));
//# sourceMappingURL=iterables.js.map