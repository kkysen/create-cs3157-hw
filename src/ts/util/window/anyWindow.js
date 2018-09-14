"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const when_1 = require("../misc/when");
exports.isBrowser = typeof window !== "undefined";
exports.inBrowser = when_1.when(exports.isBrowser);
exports.anyWindow = exports.isBrowser ? window : global;
exports.globals = function (o) {
    Object.assign(exports.anyWindow, o);
};
exports.globalProperties = function (o) {
    Object.assignProperties(exports.anyWindow, o);
};
exports.globals({ globals: exports.globals, globalProperties: exports.globalProperties });
//# sourceMappingURL=anyWindow.js.map