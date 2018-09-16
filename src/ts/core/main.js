"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const allExtensions_1 = require("../util/extensions/allExtensions");
const Dir_1 = require("../util/io/Dir");
const Lab_1 = require("./Lab");
allExtensions_1.addExtensions();
async function asyncMain() {
    Dir_1.Dir.createDir = fs.ensureDir; // don't overwrite
    const lab = await Lab_1.Lab.fromInstructions({
        instructionsPath: "/mnt/c/Users/Khyber/Downloads/03-lab1.txt",
        parentDir: "/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test",
    });
    await lab.create();
    // await lab.submit();
}
function main() {
    (async () => {
        try {
            await asyncMain();
        }
        catch (e) {
            console.error(e);
        }
    })();
    // Dir.createDir = fs.ensureDir; // don't overwrite
    // TODO implement better merge
    const lab = Lab_1.Lab.new({
        number: 1,
        numParts: 3,
        instructionsPath: "/mnt/c/Users/Khyber/Downloads/03-lab1.txt",
        parentDir: "/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test",
    });
}
main();
//# sourceMappingURL=main.js.map