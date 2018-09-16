"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const isType_1 = require("../types/isType");
exports.FileToCreate = {
    of(path, contents) {
        return {
            path,
            create: async () => {
                const _isFunction = isType_1.isFunction;
                const data = !isType_1.isFunction(contents) ? contents : contents();
                return await fs.writeFile(path, await data);
            },
        };
    }
};
//# sourceMappingURL=FileToCreate.js.map