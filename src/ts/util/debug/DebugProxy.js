"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isType_1 = require("../types/isType");
exports.DebugProxy = {
    for(target, options = {}, name = "Target") {
        const handler = {
            get: (target, p, receiver) => {
                if (!target._hasProperty(p) && (!isType_1.isString(p) || !p.startsWith("__"))) {
                    throw new TypeError(`${p.toString()} is not yet implemented on ${name} ${target}`);
                }
                return Reflect.get(target, p, receiver);
            },
        };
        for (const [key, value] of Object.entries(options)) {
            if (value === false) {
                handler[key] = undefined;
            }
        }
        return new Proxy(target, handler);
    },
};
//# sourceMappingURL=DebugProxy.js.map