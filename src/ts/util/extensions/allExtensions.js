"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("../misc/compare");
const equals_1 = require("../misc/equals");
const mapFields_1 = require("../object/mapFields");
const Truthy_1 = require("../types/Truthy");
const anyWindow_1 = require("../window/anyWindow");
const extensionsConfig_1 = require("./extensionsConfig");
const immutableDescriptor = Object.freeze({
    writable: extensionsConfig_1.writableExtensions,
    enumerable: false,
    configurable: true,
});
const defineSharedProperties = function (obj, sharedDescriptor, propertyValues, overwrite = true) {
    const properties = Object.getOwnPropertyDescriptors(propertyValues);
    Object.entries(properties).forEach(([propertyName, property]) => {
        if (!overwrite && obj[propertyName]) {
            return;
        }
        property = { ...property, ...sharedDescriptor };
        if (property.get || property.set) {
            delete property.writable;
        }
        properties[propertyName] = property;
    });
    Object.defineProperties(obj, properties);
};
defineSharedProperties(Object, immutableDescriptor, {
    defineSharedProperties,
    defineImmutableProperties(obj, propertyValues, overwrite = true) {
        defineSharedProperties(obj, immutableDescriptor, propertyValues, overwrite);
    },
});
Object.defineImmutableProperties(Object, {
    allKeys(t) {
        return [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
    },
    allValues(t) {
        return Object.allKeys(t).map(key => t[key]);
    },
    allEntries(t) {
        return Object.allKeys(t).map(key => [key, t[key]]);
    },
    definePolyfillProperties(obj, propertyValues) {
        Object.defineImmutableProperties(obj, propertyValues, false);
    },
    getPrototypeChain(object) {
        const chain = [];
        for (let o = object; o !== null; o = Object.getPrototypeOf(o)) {
            chain.push(o);
        }
        return chain;
    },
    getAllPropertyNames(object) {
        return Array.from(new Set(Object.getPrototypeChain(object)
            .flatMap(proto => Object.getOwnPropertyNames(proto))));
    },
    assignProperties(target, ...sources) {
        for (const source of sources) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        }
    },
    getting(key) {
        return o => o[key];
    },
    deleting(key) {
        return o => {
            delete o[key];
            return o;
        };
    },
});
Object.defineImmutableProperties(Object.prototype, {
    _hasProperty(property) {
        for (let o = this; o !== null; o = Object.getPrototypeOf(o)) {
            if (o.hasOwnProperty(property)) {
                return true;
            }
        }
        return false;
    },
    freeze() {
        return Object.freeze(this);
    },
    seal() {
        return Object.seal(this);
    },
    shallowClone() {
        return Object.assign(Object.create(null), this);
    },
    fullClone() {
        return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    },
    mapFields(mapper) {
        return mapFields_1.mapFields(this, mapper);
    },
    freezeFields() {
        for (const value of Object.values(this)) {
            value.freeze();
        }
        return this;
    }
});
Object.defineImmutableProperties(Function, {
    compose(...funcs) {
        const numFuncs = funcs.length;
        if (numFuncs === 0) {
            return () => undefined;
        }
        const [firstFunc, ...restFunc] = funcs;
        if (numFuncs === 1) {
            return firstFunc();
        }
        return function (...args) {
            let result = firstFunc();
            for (const func of funcs) {
                result = func(result);
            }
            return result;
        };
    },
});
Object.defineImmutableProperties(Function.prototype, {
    then_(nextFunc) {
        return (arg) => nextFunc(this(arg));
    },
    applyReturning() {
        return (arg) => {
            this(arg);
            return arg;
        };
    },
    mapping() {
        return array => array.map(this);
    },
    applying() {
        return array => this(...array);
    },
    timed() {
        const timer = (...args) => {
            const { name } = this;
            console.time(name);
            const returnValue = this(...args);
            console.timeEnd(name);
            return returnValue;
        };
        return timer.named("timing_" + this.name);
    },
    setName(name) {
        Object.defineProperties(this, {
            name: {
                value: name,
            },
        });
    },
    named(name) {
        this.setName(name);
        return this;
    },
    negate() {
        return ((...args) => !this(...args));
    },
});
Object.defineImmutableProperties(Array.prototype, {
    size() {
        return this.length;
    },
    last() {
        return this[this.length - 1];
    },
    clear() {
        this.length = 0;
    },
    removeAt(index) {
        return this.splice(index, 1)[0];
    },
    remove(value, equals) {
        const i = !equals ? this.indexOf(value) : this.findIndex(equals_1.equals.bind(equals, value));
        if (i !== -1) {
            return this.removeAt(i);
        }
    },
    add(index, value) {
        this.splice(index, 0, value);
    },
    addAll(values, index = this.length) {
        if (index === this.length) {
            this.push(...values);
        }
        else {
            this.splice(index, 0, ...values);
        }
    },
    applyOn(func) {
        return func(this);
    },
    callOn(func) {
        return func(...this);
    },
    toObject(noPrototype = false) {
        let o = noPrototype ? Object.create(null) : {};
        for (const [k, v] of this) {
            o[k] = v;
        }
        return o;
    },
    sortBy(key) {
        return this.sort(compare_1.cmp.byNumber(key));
    },
    random() {
        return this[Math.floor(Math.random() * this.length)];
    },
    mapCall() {
        return this.map(f => f());
    },
    callEach(u) {
        this.forEach(f => f(u));
    },
    async asyncForEach(func) {
        await Promise.all(this.map(func));
    },
    mapFilter(map) {
        return this.map(map).filter(Truthy_1.truthy);
    },
    asyncMap(map) {
        return Promise.all(this.map(map));
    },
    async asyncFilter(filter) {
        return (await Promise.all(this.map(async (value, index, array) => ({ value, filtered: await filter(value, index, array) })))).filter(e => e.filtered).map(e => e.value);
    },
    async asyncMapFilter(map) {
        return (await Promise.all(this.map(map))).filter(Truthy_1.truthy);
    },
    readOnly() {
        return this;
    },
    _() {
        return this;
    },
});
Object.definePolyfillProperties(Array.prototype, {
    flatMap(flatMap, thisArg) {
        if (thisArg) {
            flatMap = flatMap.bind(thisArg);
        }
        return [].concat(...this.map(flatMap));
    },
    flatten(depth = -1) {
        // TODO faster flatten polyfill
        return depth === 0
            ? this
            : this.reduce((a, e) => a.concat(Array.isArray(e) ? e.flatten(depth - 1) : e), []);
    },
});
const nativeSlice = String.prototype.slice;
Object.defineImmutableProperties(String.prototype, {
    equals(s) {
        return this === s;
    },
    boundEquals() {
        return s => this === s;
    },
    // allow negative indices for end
    slice(start = 0, end = this.length) {
        if (end < 0) {
            end = this.length + end;
        }
        return nativeSlice.call(this, start, end);
    },
});
Object.defineImmutableProperties(Number, {
    isNumber(n) {
        return !Number.isNaN(n);
    },
    toPixels(n) {
        return Math.round(n) + "px";
    },
});
Object.defineImmutableProperties(Map.prototype, {
    map(map) {
        return new Map([...this].map(([k, v]) => [k, map(v, k)]));
    },
});
Object.defineImmutableProperties(Set.prototype, {
    map(map) {
        return new Set([...this].map(map));
    },
});
// don't touch RegExp.prototype,
// since modifying it will bail out of RegExp's fast paths.
if (anyWindow_1.isBrowser) {
    Object.defineImmutableProperties(Node.prototype, {
        appendBefore(node) {
            const { parentNode } = this;
            parentNode && parentNode.insertBefore(node, this);
            return node;
        },
        appendAfter(node) {
            const { nextSibling } = this;
            nextSibling && nextSibling.appendBefore(node);
            return node;
        },
    });
    Object.defineImmutableProperties(Element.prototype, {
        clearHTML() {
            this.innerHTML = "";
        },
        setAttributes(attributes) {
            for (const [attribute, value] of Object.entries(attributes)) {
                if (value) {
                    this.setAttribute(attribute, value.toString());
                }
            }
        },
    });
    Object.defineImmutableProperties(HTMLElement.prototype, {
        appendTo(parent) {
            parent.appendChild(this);
            return this;
        },
        appendNewElement(tagName) {
            return this.appendChild(document.createElement(tagName));
        },
        appendDiv() {
            return this.appendNewElement("div");
        },
        appendButton(buttonText) {
            const button = this.appendNewElement("button");
            button.innerText = buttonText;
            return button;
        },
        appendBr() {
            return this.appendNewElement("br");
        },
        withInnerText(text) {
            this.innerText = text;
            return this;
        },
        withInnerHTML(html) {
            this.innerHTML = html;
            return this;
        },
    });
    Object.defineImmutableProperties(HTMLIFrameElement.prototype, {
        activate() {
            this.appendTo(document.body);
            return this;
        },
    });
}
exports.addExtensions = function () {
};
//# sourceMappingURL=allExtensions.js.map