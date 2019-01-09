"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringio_1 = require("@rauschma/stringio");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const Range_1 = require("../util/collections/Range");
const allExtensions_1 = require("../util/extensions/allExtensions");
const Dir_1 = require("../util/io/Dir");
const Lab_1 = require("./Lab");
allExtensions_1.addExtensions();
async function findInstructionsPath(labNumber, dirPath = "/mnt/c/Users/Khyber/Downloads") {
    const dir = Dir_1.Dir.of(dirPath);
    const files = await dir.ls();
    const file = files.find(file => file.endsWith(`-lab${labNumber}.txt`));
    return file && dir.file(file);
}
async function asyncMain() {
    Dir_1.Dir.createDir = fs.ensureDir; // don't overwrite
    const labNumber = parseInt(process.argv[2]);
    if (isNaN(labNumber)) {
        console.log(`Invalid lab number: ${process.argv[2]}`);
        return;
    }
    const instructionsPath = await findInstructionsPath(labNumber);
    if (!instructionsPath) {
        console.log(`Couldn't find instructions for lab ${labNumber}`);
        return;
    }
    console.log(`Found instructions at: ${instructionsPath}`);
    const lab = await Lab_1.Lab.fromInstructions({
        instructionsPath,
    });
    await lab.create();
    // await lab.submit();
}
async function misc() {
    const outputs = await Range_1.Range.new(100)
        .fill("./main")
        .map(cmd => child_process_1.spawn(cmd))
        .map(child => child.stdout)
        .asyncMap(stdout => stringio_1.readableToString(stdout));
    const outputLines = Range_1.Range.new(10000).map(() => new Set());
    outputs.map(s => s.split("\n"))
        .forEach(lines => lines.forEach((line, i) => outputLines[i].add(line)));
    outputLines.mapFilter((lines, i) => lines.size > 1 && { i, lines })
        .map(({ i, lines }) => ({ i, n: lines.size }))
        .forEach(e => console.log(e));
}
function main() {
    (async () => {
        try {
            // await misc();
            await asyncMain();
        }
        catch (e) {
            console.error(e);
        }
    })();
}
main();
//# sourceMappingURL=main.js.map