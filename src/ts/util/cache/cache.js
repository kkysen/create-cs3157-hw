"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getter = function (t) {
    return () => t;
};
exports.makeGetter = function () {
    return exports.getter;
};
exports.cache = function (getter) {
    return exports.refreshableCache(getter).get;
};
exports.refreshableCache = function (getter, onRefresh = () => {
}) {
    let cache;
    const get = ((...args) => cache !== undefined ? cache : (cache = getter(...args)));
    const refresh = () => {
        cache = undefined;
        onRefresh();
    };
    return {
        get,
        refresh,
        getRefreshed: ((...args) => {
            refresh();
            return get(...args);
        }),
    };
};
exports.asyncCache = function (getter, onRefresh) {
    return exports.refreshableAsyncCache(getter, onRefresh).get;
};
exports.refreshableAsyncCache = function (getter, onRefresh = () => {
}) {
    let cache;
    const refresh = () => {
        cache = undefined;
        onRefresh();
    };
    const get = (args) => cache !== undefined ? cache : cache = (async () => cache = await getter(args))();
    return {
        get,
        refresh,
        getRefreshed: async (args) => {
            refresh();
            return await get(args);
        },
    };
};
//# sourceMappingURL=cache.js.map