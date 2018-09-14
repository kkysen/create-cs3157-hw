"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncRefresh = {
    of(t) {
        return Object.assign(t, {
            refresh: async () => {
                const promises = Object.values(t).mapFilter(e => e.refresh).mapCall();
                await Promise.all(promises);
                return t;
            },
        });
    },
};
//# sourceMappingURL=Refresh.js.map