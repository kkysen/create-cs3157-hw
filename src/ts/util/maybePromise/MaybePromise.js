"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isType_1 = require("../types/isType");
exports.forcePromise = function (maybePromise) {
    if (isType_1.isPromise(maybePromise)) {
        return maybePromise;
    }
    return Promise.resolve(maybePromise);
};
//# sourceMappingURL=MaybePromise.js.map