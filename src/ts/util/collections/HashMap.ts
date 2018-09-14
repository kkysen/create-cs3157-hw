import {bind} from "../decorators/bind";
import {iterables} from "../functional/iterables";
import {hash as hashLib} from "../misc/hash";
import {hashEquals as hashEqualsLib} from "../misc/hashEquals";
import {NotImplementedError} from "../misc/utils";
import {Difference} from "../types/difference";
import {IfElse} from "../types/IfElse";
import {NativeMap} from "../types/typeAliases";
import {ArrayStack} from "./ArrayStack";
import {
    BaseCollection,
    checkSizeChanged,
    Collection,
    CollectionConstructor,
    ExtendedCollection,
    NewCollectionArgs
} from "./Collection";
import {HashSet} from "./HashSet";
import {Map, MapEntry} from "./Map";
import {Set} from "./Set";
import HashEquals = hashEqualsLib.HashEquals;
import HashValue = hashLib.HashValue;

export interface HashMap<K, V> extends Map<K, V> {
    
    // TODO
    
}

interface HashMapArgs<K, KH, V, VH> extends NewCollectionArgs<MapEntry<K, V>, number> {
    
    keysHashEquals?: HashEquals<K, KH>;
    valuesHashEquals?: HashEquals<V, VH>;
    
}

export interface HashMapClass {
    
    readonly new: <K, V, KH = HashValue, VH = HashValue>(args: HashMapArgs<K, KH, V, VH>) => HashMap<K, V>;
    
    readonly referential: <K, V, VH = HashValue>(args: HashMapArgs<K, K, V, VH>) => HashMap<K, V>;
    
    readonly perfectHash: <K, V, KH = HashValue, VH = HashValue>(
        args: HashMapArgs<K, KH, V, VH> & {keysHashEquals: HashEquals<K, KH>}) => HashMap<K, V>;
    
}

// TODO add referential version like in HashSet
// TODO add perfect hash version (for keys like Date or enums), b/c can be optimized (no linked lists)
// TODO add perfect hash version to HashSet, too

export const HashMap: HashMapClass = {
    
    new<K, V, H, VH>(
        {
            elements = [],
            hashEquals,
            keysHashEquals = hashEqualsLib.default_(),
            valuesHashEquals = hashEqualsLib.default_(),
        }: HashMapArgs<K, H, V, VH>): HashMap<K, V> {
        
        type This = HashMap<K, V>;
        type E = MapEntry<K, V>;
        
        interface Node extends E {
            next?: Node;
        }
        
        type Node$ = Node | undefined;
        
        interface ReturnedNode {
            exists: boolean;
            key: K;
            value?: V;
            
            put(value: V): V | undefined;
            
            remove(): V | undefined;
        }
        
        interface ExistingReturnedNode {
            exists: true,
            key: K;
            value: V;
            
            put(value: V): V;
            
            remove(): V;
        }
        
        const exists = (node: ReturnedNode): node is ExistingReturnedNode => node.exists;
        
        const {hash, equals} = hashEqualsLib.fastEquals(keysHashEquals);
        const {hash: valueHash, equals: valueEquals} = hashEqualsLib.fastEquals(valuesHashEquals);
        
        hashEquals = {
            hash: ({key, value}) => hashLib.makeNumber(hash(key)) ^ hashLib.makeNumber(valueHash(value)),
            equals: (e1, e2) => equals(e1.key, e2.key) && valueEquals(e1.value, e2.value),
        };
        
        const table: NativeMap<H, Node> = bind(new NativeMap());
        const {clear, values} = table;
        
        const getNode = function(key: K): ReturnedNode {
            const h = hash(key);
            let node = table.get(h);
            if (!node) {
                return {
                    exists: false,
                    key,
                    put: value => (table.set(h, {key, value}), undefined),
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
            
            for (let next: Node$, prev: Node$; next = node.next; prev = node, node = next) {
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
                        } else if (next) {
                            table.set(h, next);
                        } else {
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
                put: value => (n.next = {key, value}, undefined),
                remove: () => n.next = undefined,
            };
        };
        
        const size = () => table.size;
        
        const put = function(key: K, value: V): V | undefined {
            return getNode(key).put(value);
        };
        
        const removeKey = function(key: K): V | undefined {
            return getNode(key).remove();
        };
        
        const sized = function <T>(wrapped: (arg: T) => void): (arg: T) => boolean {
            return checkSizeChanged(size, wrapped);
        };
        
        const base: BaseCollection<E> = {
            size,
            clear,
            add: ({key, value}) => {
                const node = getNode(key);
                node.put(value);
                return !node.exists;
            },
            remove: ({key, value}) => {
                const node = getNode(key);
                if (exists(node) && valueEquals(value, node.value)) {
                    node.remove();
                    return true;
                }
                return false;
            },
            [Symbol.iterator]: function* () {
                for (let node of values()) {
                    for (let n: Node$ = node; n; n = n.next) {
                        yield n;
                    }
                }
            },
        };
        
        const hasKey = function(key: K): boolean {
            return getNode(key).exists;
        };
        
        const get = function(key: K): V | undefined {
            return getNode(key).value;
        };
        
        const getOrDefault = function(key: K, defaultValue: V): V {
            const node = getNode(key);
            return exists(node) ? node.value : defaultValue;
        };
        
        const getOrPutDefault = function(key: K, defaultValue: V): V {
            const node = getNode(key);
            return exists(node) ? node.value : (node.put(defaultValue), defaultValue);
        };
        
        const getByValue = function(remove: boolean) {
            return function(v: V): boolean {
                for (const {key, value} of base) {
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
        
        const putIfDefined = function <Exists extends boolean>(
            node: ReturnedNode, value: IfElse<Exists, V, undefined>
        ): IfElse<Exists, V, undefined> {
            if (value !== undefined) {
                node.put(value as V);
            } else {
                node.remove();
            }
            return value;
        };
        
        // noinspection TypeScriptValidateJSTypes
        const map: Difference<This, Collection<E>> = {
            ...{} as Iterable<E>, // needed b/c keyof doesn't see Symbol.iterator
            
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
            computeIfAbsent: <typeof _.computeIfAbsent> ((key, mapper) => {
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
            
            keys: () => Collection.basedOn<K, H, Set<K>>({
                size,
                clear,
                add: () => {
                    throw new NotImplementedError();
                },
                remove: e => {
                    const node = getNode(e);
                    node.remove();
                    return node.exists;
                },
                ...iterables.map(_, e => e.key),
                has: hasKey,
            }, keysHashEquals, HashSet.new),
            
            values: () => Collection.basedOn<V, VH, Collection<V>>({
                size,
                clear,
                add: () => {
                    throw new NotImplementedError();
                },
                remove: removeValue,
                ...iterables.map(_, e => e.value),
            }, valuesHashEquals, ArrayStack.new),
            // TODO change to ArrayList.new
        };
        
        const extended: Partial<ExtendedCollection<E>> = {
            has: ({key, value}) => {
                const node = getNode(key);
                return exists(node) && valueEquals(value, node.value);
            },
            toString: () => `{${
                toArray()
                    .map(({key, value}) => `${key} = ${value}`)
                    .join("\n")
                }`,
        };
        
        const _: This = Collection.basedOn<E, number, This>({
            ...base,
            ...map,
            ...extended,
        }, hashEquals, HashMap.new as CollectionConstructor);
        // TODO why do I need this type assertion
        
        const {toArray, addAll} = _;
        
        addAll(elements);
        
        return _;
    },
    
    referential<K, V, VH = HashValue>(args: HashMapArgs<K, K, V, VH>): HashMap<K, V> {
        args.keysHashEquals = hashEqualsLib.referential();
        return HashMap.new(args);
    },
    
    perfectHash<K, V, H, VH>(args: HashMapArgs<K, H, V, VH> & {keysHashEquals: HashEquals<K, H>}): HashMap<K, V> {
        // TODO
        return HashMap.new(args);
    },
    
};