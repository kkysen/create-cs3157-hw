"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bind_1 = require("../decorators/bind");
const iterables_1 = require("../functional/iterables");
const hash_1 = require("../misc/hash");
const hashEquals_1 = require("../misc/hashEquals");
const utils_1 = require("../misc/utils");
const typeAliases_1 = require("../types/typeAliases");
const ArrayStack_1 = require("./ArrayStack");
const Collection_1 = require("./Collection");
const HashSet_1 = require("./HashSet");
// TODO add referential version like in HashSet
// TODO add perfect hash version (for keys like Date or enums), b/c can be optimized (no linked lists)
// TODO add perfect hash version to HashSet, too
exports.HashMap = {
    new({ elements = [], hashEquals, keysHashEquals = hashEquals_1.hashEquals.default_(), valuesHashEquals = hashEquals_1.hashEquals.default_(), }) {
        const exists = (node) => node.exists;
        const { hash, equals } = hashEquals_1.hashEquals.fastEquals(keysHashEquals);
        const { hash: valueHash, equals: valueEquals } = hashEquals_1.hashEquals.fastEquals(valuesHashEquals);
        hashEquals = {
            hash: ({ key, value }) => hash_1.hash.makeNumber(hash(key)) ^ hash_1.hash.makeNumber(valueHash(value)),
            equals: (e1, e2) => equals(e1.key, e2.key) && valueEquals(e1.value, e2.value),
        };
        const table = bind_1.bind(new typeAliases_1.NativeMap());
        const { clear, values } = table;
        const getNode = function (key) {
            const h = hash(key);
            let node = table.get(h);
            if (!node) {
                return {
                    exists: false,
                    key,
                    put: value => (table.set(h, { key, value }), undefined),
                    remove: () => undefined,
                };
            }
            // explicitly check first node
            if (equals(key, node.key)) {
                const n = node;
                n.key = key;
                return {
                    exists: true,
                    key,
                    value: n.value,
                    put: value => {
                        const v = n.value;
                        n.value = value;
                        return v;
                    },
                    remove: () => {
                        const value = n.value;
                        table.delete(h);
                        return value;
                    },
                };
            }
            for (let next, prev; next = node.next; prev = node, node = next) {
                const k = node.key;
                if (!equals(k, key)) {
                    continue;
                }
                const n = node;
                n.key = key;
                return {
                    exists: true,
                    key: n.key,
                    value: n.value,
                    put: value => {
                        const v = n.value;
                        n.value = value;
                        return v;
                    },
                    remove: () => {
                        const value = n.value;
                        if (prev) {
                            prev.next = next;
                        }
                        else if (next) {
                            table.set(h, next);
                        }
                        else {
                            table.delete(h);
                        }
                        return value;
                    },
                };
            }
            const n = node;
            return {
                exists: false,
                key,
                put: value => (n.next = { key, value }, undefined),
                remove: () => n.next = undefined,
            };
        };
        const size = () => table.size;
        const put = function (key, value) {
            return getNode(key).put(value);
        };
        const removeKey = function (key) {
            return getNode(key).remove();
        };
        const sized = function (wrapped) {
            return Collection_1.checkSizeChanged(size, wrapped);
        };
        const base = {
            size,
            clear,
            add: ({ key, value }) => {
                const node = getNode(key);
                node.put(value);
                return !node.exists;
            },
            remove: ({ key, value }) => {
                const node = getNode(key);
                if (exists(node) && valueEquals(value, node.value)) {
                    node.remove();
                    return true;
                }
                return false;
            },
            [Symbol.iterator]: function* () {
                for (let node of values()) {
                    for (let n = node; n; n = n.next) {
                        yield n;
                    }
                }
            },
        };
        const hasKey = function (key) {
            return getNode(key).exists;
        };
        const get = function (key) {
            return getNode(key).value;
        };
        const getOrDefault = function (key, defaultValue) {
            const node = getNode(key);
            return exists(node) ? node.value : defaultValue;
        };
        const getOrPutDefault = function (key, defaultValue) {
            const node = getNode(key);
            return exists(node) ? node.value : (node.put(defaultValue), defaultValue);
        };
        const getByValue = function (remove) {
            return function (v) {
                for (const { key, value } of base) {
                    if (valueEquals(v, value)) {
                        if (remove) {
                            removeKey(key);
                        }
                        return true;
                    }
                }
                return false;
            };
        };
        const removeValue = getByValue(true);
        const putIfDefined = function (node, value) {
            if (value !== undefined) {
                node.put(value);
            }
            else {
                node.remove();
            }
            return value;
        };
        // noinspection TypeScriptValidateJSTypes
        const map = {
            ...{},
            put,
            removeKey,
            removeValue,
            hasKey,
            get,
            getOrDefault,
            getOrPutDefault,
            putIfAbsent: (key, value) => {
                const node = getNode(key);
                if (!node.exists) {
                    node.put(value);
                }
            },
            putAll: map => {
                // TODO optimize
                addAll(map);
            },
            replace: (key, value) => {
                const node = getNode(key);
                return exists(node) ? node.put(value) : undefined;
            },
            replaceIfEquals: (key, oldValue, newValue) => {
                const node = getNode(key);
                const replace = exists(node) && valueEquals(oldValue, node.value);
                if (replace) {
                    node.put(newValue);
                }
                return replace;
            },
            computeIfAbsent: ((key, mapper) => {
                const node = getNode(key);
                if (exists(node)) {
                    return node.value;
                }
                return putIfDefined(node, mapper(key));
            }),
            computeIfPresent: (key, remapper) => {
                const node = getNode(key);
                if (!exists(node)) {
                    return undefined;
                }
                return putIfDefined(node, remapper(key, node.value));
            },
            compute: (key, remapper) => {
                const node = getNode(key);
                return putIfDefined(node, remapper(key, node.value));
            },
            merge: (key, value, remapper) => {
                const node = getNode(key);
                return putIfDefined(node, remapper(key, exists(node) ? node.value : value));
            },
            hasValue: getByValue(false),
            entries: () => _,
            keys: () => Collection_1.Collection.basedOn({
                size,
                clear,
                add: () => {
                    throw new utils_1.NotImplementedError();
                },
                remove: e => {
                    const node = getNode(e);
                    node.remove();
                    return node.exists;
                },
                ...iterables_1.iterables.map(_, e => e.key),
                has: hasKey,
            }, keysHashEquals, HashSet_1.HashSet.new),
            values: () => Collection_1.Collection.basedOn({
                size,
                clear,
                add: () => {
                    throw new utils_1.NotImplementedError();
                },
                remove: removeValue,
                ...iterables_1.iterables.map(_, e => e.value),
            }, valuesHashEquals, ArrayStack_1.ArrayStack.new),
        };
        const extended = {
            has: ({ key, value }) => {
                const node = getNode(key);
                return exists(node) && valueEquals(value, node.value);
            },
            toString: () => `{${toArray()
                .map(({ key, value }) => `${key} = ${value}`)
                .join("\n")}`,
        };
        const _ = Collection_1.Collection.basedOn({
            ...base,
            ...map,
            ...extended,
        }, hashEquals, exports.HashMap.new);
        // TODO why do I need this type assertion
        const { toArray, addAll } = _;
        addAll(elements);
        return _;
    },
    referential(args) {
        args.keysHashEquals = hashEquals_1.hashEquals.referential();
        return exports.HashMap.new(args);
    },
    perfectHash(args) {
        // TODO
        return exports.HashMap.new(args);
    },
};
//# sourceMappingURL=HashMap.js.map