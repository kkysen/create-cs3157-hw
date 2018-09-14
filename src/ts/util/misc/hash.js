"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../functional/utils");
const fnv1a_1 = require("../hash/fnv1a");
const isType_1 = require("../types/isType");
var hash;
(function (hash_1) {
    hash_1.referential = function () {
        return utils_1.identity;
    };
    hash_1.default_ = function () {
        return JSON.stringify;
    };
    hash_1.makeNumber = function (hash) {
        return isType_1.isNumber(hash) ? hash : fnv1a_1.fnv1a(isType_1.isString(hash) ? hash : hash_1.default_()(hash));
    };
})(hash = exports.hash || (exports.hash = {}));
//# sourceMappingURL=hash.js.map