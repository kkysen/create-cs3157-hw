"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../misc/utils");
exports.isNativeType = function (type) {
    const typeName = `[object ${utils_1.capitalize(type)}]`;
    const toString = Object.prototype.toString;
    return (o) => toString.call(o) === typeName;
};
// can use isNativeType for all, but some can be optimized
exports.isNull = (o) => o === null;
exports.isUndefined = (o) => o === undefined;
exports.isBoolean = (o) => o === true || o === false;
exports.isNumber = exports.isNativeType("number");
exports.isString = exports.isNativeType("string");
exports.isFunction = (o) => typeof o === "function";
exports.isArray = Array.isArray;
exports.isReadonlyArray = Array.isArray;
exports.isRegExp = exports.isNativeType("RegExp");
exports.isDate = exports.isNativeType("Date");
exports.isObject = exports.isNativeType("object");
exports._isTruthy = (o) => !!o;
exports.isTruthy = () => exports._isTruthy;
exports.isByConstructor = function (constructor) {
    return (o) => o.constructor === constructor;
};
exports.isDataView = exports.isByConstructor(DataView);
exports.isArrayBuffer = exports.isByConstructor(ArrayBuffer);
exports.isPromise = exports.isByConstructor(Promise);
//# sourceMappingURL=isType.js.map