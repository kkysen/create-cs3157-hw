"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const regex_1 = require("./regex");
var equals;
(function (equals_1) {
    const _referential = Object.is;
    equals_1.referential = function () {
        return _referential;
    };
    equals_1.bind = function (equals, t1) {
        return t2 => equals(t1, t2);
    };
    equals_1.by = function (keyExtractor) {
        return (t1, t2) => keyExtractor(t1) === keyExtractor(t2);
    };
    const _default = function (t1, t2) {
        return _referential(t1, t2) || equals_1.by(hash_1.hash.referential())(t1, t2);
    };
    equals_1.default_ = function () {
        return _default;
    };
    const isReferentialEqualitySource = (() => {
        const twoArgs = /\(([^\s,]*)\s*,\s*([^\s)]*)\)/;
        const equality = /\s*\1\s*===\s*\2/;
        const functionBody = regex_1.regex.join(/\s*{\s*return/, equality, /\s*;\s*}/);
        const func = regex_1.regex.join(/function\s*/, twoArgs, functionBody);
        const arrow = /\s*=>/;
        const arrowFuncWithBody = regex_1.regex.join(twoArgs, arrow, functionBody);
        const arrowFunc = regex_1.regex.join(twoArgs, arrow, equality);
        return s => [arrowFunc, arrowFuncWithBody, func].some(regex => regex.test(s));
    })();
    equals_1.fast = function (equals) {
        // means equals is using referential equality, don't repeat
        // double checking referential equality is cheap except for strings
        const _referential = equals_1.referential();
        if (equals === _referential || isReferentialEqualitySource(equals.toString())) {
            return _referential;
        }
        return (t1, t2) => t1 === t2 || equals(t1, t2);
    };
})(equals = exports.equals || (exports.equals = {}));
//# sourceMappingURL=equals.js.map