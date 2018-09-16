"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const regex_1 = require("../util/misc/regex");
function findLabNumber(instructions) {
    const match = /Lab #([0-9])+/i.exec(instructions);
    if (!match) {
        throw new Error("no lab number found");
    }
    return parseInt(match[1]);
}
function findNumberOfLabParts(instructions) {
    const partNums = regex_1.regex.matchAll(/Part ([0-9]+)/gi, instructions)
        .map(([, partNum]) => partNum)
        .map(e => parseInt(e))
        .sort();
    if (!partNums.every((e, i) => e === i)) {
        throw new Error("missing parts");
    }
    return partNums.length;
}
exports.LabInstructions = {
    async from(path) {
        const buffer = await fs.readFile(path);
        const instructions = buffer.toString();
        return {
            path,
            number: findLabNumber(instructions),
            numParts: findNumberOfLabParts(instructions),
        };
    },
};
// (async () => {
//     await FileToCreate.of("tmp.txt", async () => {
//         return "Hello";
//     }).create();
// })();
//# sourceMappingURL=LabInstructions.js.map