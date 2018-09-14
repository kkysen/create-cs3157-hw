"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.All = {
    of(a, bySample) {
        const map = (key) => new Map(a.map(e => [e[key], e]));
        const mapBy = (key) => {
            const byMap = map(key);
            return (by) => byMap.get(by);
        };
        const maps = Object.keys(bySample)
            .map(key => [key, mapBy(key)]);
        const byMap = maps.toObject();
        return {
            all: a,
            by: Object.assign(byMap, {
                index: (i) => a[i],
            }),
        };
    },
};
//# sourceMappingURL=All.js.map