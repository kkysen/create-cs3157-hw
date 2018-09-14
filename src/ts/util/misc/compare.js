"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cmp;
(function (cmp) {
    cmp.byNumber = function (keyExtractor) {
        return (t1, t2) => keyExtractor(t1) - keyExtractor(t2);
    };
    cmp.byNumeric = function (keyExtractor) {
        return cmp.byNumber(keyExtractor.then_(e => e.valueOf()));
    };
    cmp.byString = function (keyExtractor) {
        return (t1, t2) => {
            const k1 = keyExtractor(t1);
            const k2 = keyExtractor(t2);
            return k1 === k2 ? 0 : k1 < k2 ? -1 : 1;
        };
    };
})(cmp = exports.cmp || (exports.cmp = {}));
//# sourceMappingURL=compare.js.map