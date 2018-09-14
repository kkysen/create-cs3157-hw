import * as nodePath from "path";
import {isBrowser} from "../window/anyWindow";
import {addExtensions} from "../extensions/allExtensions";

export const path: typeof nodePath = (() => {
    if (isBrowser) {
        const pathBrowserify = require("path-browserify");
        
        addExtensions();
        
        const path: typeof nodePath = nodePath;
        
        const oldNodePath: typeof path = path.fullClone();

        // add any missing properties in webpack's path polyfill
        // with the complete path-browserify polyfill
        // (even though they're supposed to be the same, they're not (path.parse is missing))
        Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(pathBrowserify));
        Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(oldNodePath));
        return path;
    } else {
        return nodePath;
    }
})();

export const pathLib = path;