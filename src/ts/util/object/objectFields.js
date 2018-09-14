"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isType_1 = require("../types/isType");
var objectFields;
(function (objectFields) {
    objectFields.map = function (t, mapper) {
        return t.mapFields(mapper);
    };
    objectFields.callEach = function (functions) {
        return objectFields.map(functions, f => f());
    };
    objectFields.callEachArgs = function (functions, args) {
        return objectFields.map(functions, f => f(args));
    };
    objectFields.awaitAll = function (promises) {
        if (!Object.values(promises).some(isType_1.isPromise)) {
            return promises;
        }
        return (async () => (await Object.entries(promises)
            .asyncMap(async ([key, promise]) => [key, await promise])).toObject())();
    };
    objectFields.awaitGetters = function (asyncGetters) {
        return objectFields.awaitAll(objectFields.callEach(asyncGetters));
    };
    objectFields.awaitFunctions = function (asyncFunctions, args) {
        return objectFields.awaitAll(objectFields.callEachArgs(asyncFunctions, args));
    };
    objectFields.awaitRefreshableCaches = function (caches, args) {
        return objectFields.awaitAll(objectFields.map(caches, e => e.get(args)));
    };
})(objectFields = exports.objectFields || (exports.objectFields = {}));
//# sourceMappingURL=objectFields.js.map