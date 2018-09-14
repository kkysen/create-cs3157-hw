"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodePath = require("path");
const anyWindow_1 = require("../window/anyWindow");
const allExtensions_1 = require("../extensions/allExtensions");
exports.path = (() => {
    if (anyWindow_1.isBrowser) {
        const pathBrowserify = require("path-browserify");
        allExtensions_1.addExtensions();
        const path = nodePath;
        const oldNodePath = path.fullClone();
        // add any missing properties in webpack's path polyfill
        // with the complete path-browserify polyfill
        // (even though they're supposed to be the same, they're not (path.parse is missing))
        Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(pathBrowserify));
        Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(oldNodePath));
        return path;
    }
    else {
        return nodePath;
    }
})();
exports.pathLib = exports.path;
//# sourceMappingURL=path.js.map