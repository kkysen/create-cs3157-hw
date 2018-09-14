"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("../util/extensions/allExtensions");
const setupRepo_1 = require("./setupRepo");
allExtensions_1.addExtensions();
function main() {
    (async () => {
        await setupRepo_1.setupRepo("/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test");
    })();
}
exports.main = main;
main();
//# sourceMappingURL=main.js.map