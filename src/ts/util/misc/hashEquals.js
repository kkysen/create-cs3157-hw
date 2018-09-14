"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equals_1 = require("./equals");
const hash_1 = require("./hash");
var hashEquals;
(function (hashEquals_1) {
    const _referential = {
        hash: hash_1.hash.referential(),
        equals: equals_1.equals.referential(),
    };
    hashEquals_1.referential = function () {
        return _referential;
    };
    hashEquals_1.isReferential = function (hashEquals) {
        return hashEquals === _referential;
    };
    const _default = {
        hash: hash_1.hash.default_(),
        equals: equals_1.equals.default_(),
    };
    hashEquals_1.default_ = function () {
        return _default;
    };
    hashEquals_1.fastEquals = function (hashEquals) {
        return {
            hash: hashEquals.hash,
            equals: equals_1.equals.fast(hashEquals.equals),
        };
    };
    hashEquals_1.fromHash = function (hash) {
        return {
            hash,
            equals: equals_1.equals.by(hash),
        };
    };
})(hashEquals = exports.hashEquals || (exports.hashEquals = {}));
//# sourceMappingURL=hashEquals.js.map