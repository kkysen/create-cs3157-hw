"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bind_1 = require("../decorators/bind");
const iterables_1 = require("../functional/iterables");
const hashEquals_1 = require("../misc/hashEquals");
const typeAliases_1 = require("../types/typeAliases");
const Collection_1 = require("./Collection");
const HashMap_1 = require("./HashMap");
exports.HashSet = {
    new({ elements = [], hashEquals = hashEquals_1.hashEquals.default_() }) {
        if (hashEquals_1.hashEquals.isReferential(hashEquals)) {
            // if using referential HashEquals, use optimized referential version
            return exports.HashSet.referential({ elements });
        }
        const { value, done } = elements[Symbol.iterator]().next();
        if (!done && !["object", "function"].includes(typeof value)) {
            // if using a primitive type, always use referential version
            return exports.HashSet.referential({ elements }); // don't need hashEquals
        }
        const { size, clear, hasKey: has, put, removeKey: remove, keys, replaceAll, } = HashMap_1.HashMap.new({
            elements: iterables_1.iterables.map(elements, e => ({ key: e, value: null })),
            keysHashEquals: hashEquals,
            valuesHashEquals: {
                hash: t => 0,
                equals: () => true,
            },
        });
        // noinspection TypeScriptValidateJSTypes
        return Collection_1.Collection.basedOn({
            size,
            add: e => put(e, null) !== null,
            remove: e => remove(e) === null,
            clear,
            [Symbol.iterator]: () => keys()[Symbol.iterator](),
            has,
            replaceAll: replacer => replaceAll(({ key, value }) => ({ key: replacer(key), value })),
        }, hashEquals, exports.HashSet.new);
    },
    referential(args) {
        const { elements = [] } = args;
        // always use referential HashEquals, ignore args
        const hashEquals = hashEquals_1.hashEquals.referential();
        const nativeSet = bind_1.bind(new typeAliases_1.NativeSet(elements));
        const { add, has, delete: remove, clear, [Symbol.iterator]: iterator, forEach } = nativeSet;
        const size = () => nativeSet.size;
        // noinspection TypeScriptValidateJSTypes
        return Collection_1.Collection.basedOn({
            size,
            add: Collection_1.checkSizeChanged(size, add),
            remove,
            clear,
            [Symbol.iterator]: () => iterator(),
            has,
            forEach: (func => {
                let i = 0;
                forEach(e => func(e, i++));
            }),
        }, hashEquals, exports.HashSet.referential);
    },
};
//# sourceMappingURL=HashSet.js.map