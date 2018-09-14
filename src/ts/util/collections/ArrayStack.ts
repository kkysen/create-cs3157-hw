import {bind} from "../decorators/bind";
import {hash} from "../misc/hash";
import {hashEquals as hashEqualsLib} from "../misc/hashEquals";
import {checkSizeChanged, Collection, NewCollectionArgs} from "./Collection";
import {Stack} from "./Stack";
import HashValue = hash.HashValue;

// TODO make ArrayStack interface

export interface ArrayStackClass {
    
    "new"<E, H = HashValue>(args: NewCollectionArgs<E, H>): Stack<E>;
    
}

export const ArrayStack: ArrayStackClass = {
    
    new<E, H>({elements = [], hashEquals = hashEqualsLib.default_()}: NewCollectionArgs<E, H>): Stack<E> {
        const {equals} = hashEquals;
        const a: E[] = bind([...elements]);
        const {size, push, pop, last: peek, clear, remove} = a;
        // noinspection TypeScriptValidateJSTypes
        return Collection.basedOn({
            size,
            add: e => (push(e), true),
            remove: checkSizeChanged(size, (e: E) => remove(e, equals)),
            clear,
            [Symbol.iterator]: () => a[Symbol.iterator](),
            push,
            peek,
            pop,
        }, hashEquals, ArrayStack.new);
    },
    
};