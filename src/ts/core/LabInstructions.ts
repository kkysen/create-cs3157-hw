import * as fs from "fs-extra";
import {regex} from "../util/misc/regex";

export interface LabInstructions {
    number: number;
    numParts: number;
    path: string;
}

function findLabNumber(instructions: string): number {
    const match = /Lab #([0-9])+/i.exec(instructions);
    if (!match) {
        throw new Error("no lab number found");
    }
    return parseInt(match[1]);
}

function findNumberOfLabParts(instructions: string): number {
    const partNums = regex.matchAll(/Part ([0-9]+)/gi, instructions)
        .map(([, partNum]) => partNum)
        .map(e => parseInt(e))
        .sort();
    if (!partNums.every((e, i) => e === i)) {
        throw new Error("missing parts");
    }
    return partNums.length;
}

export const LabInstructions = {
    async from(path: string): Promise<LabInstructions> {
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