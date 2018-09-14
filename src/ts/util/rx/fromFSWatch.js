"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path_1 = require("../polyfills/path");
const fromListener_1 = require("./fromListener");
exports.fromFSWatch = function (filename, options) {
    return fromListener_1.fromListener(async (listener) => {
        const { dir, base } = path_1.path.parse(filename);
        const stat = await fs.stat(filename);
        const parentDir = stat.isDirectory() ? path_1.path.join(dir, base) : dir;
        fs.watch(filename, options || null, (event, _filename) => {
            const filename = _filename;
            return listener({ event, filename, path: path_1.path.join(parentDir, filename) });
        });
    });
};
//# sourceMappingURL=fromFSWatch.js.map