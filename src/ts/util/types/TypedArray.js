"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isArrayBuffer = function (typedArray) {
    return !typedArray.buffer;
};
exports.noCopyBuffer = function (typedArray) {
    if (isArrayBuffer(typedArray)) {
        return Buffer.from(typedArray);
    }
    const arrayBuffer = typedArray.buffer;
    let buffer = Buffer.from(arrayBuffer);
    if (typedArray.byteLength !== arrayBuffer.byteLength) {
        return buffer.slice(typedArray.byteOffset, typedArray.byteOffset + typedArray.byteLength);
    }
    return buffer;
};
//# sourceMappingURL=TypedArray.js.map