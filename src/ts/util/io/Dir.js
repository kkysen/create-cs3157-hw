"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path_1 = require("../polyfills/path");
const FileToCreate_1 = require("./FileToCreate");
exports.Dir = {
    createDir: fs.mkdir,
    of(dirPath) {
        const file = (fileName) => path_1.path.join(dirPath, fileName);
        const _ = {
            path: dirPath,
            dir: dirName => exports.Dir.of(file(dirName)),
            file,
            create: () => fs.mkdir(dirPath),
            fileToCreate: (fileName, contents) => FileToCreate_1.FileToCreate.of(file(fileName), contents),
            ensureCreated: () => ({
                ..._,
                create: () => fs.ensureDir(dirPath),
            }),
        };
        return _;
    },
};
//# sourceMappingURL=Dir.js.map