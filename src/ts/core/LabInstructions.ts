import * as fs from "fs-extra";
import {regex} from "../util/misc/regex";

export interface LabInstructions {
    number: number;
    partNumbers: number[];
    path: string;
}

function findLabNumber(instructions: string): number {
    const match = /Lab #([0-9]+)/i.exec(instructions);
    if (!match) {
        throw new Error("no lab number found");
    }
    return parseInt(match[1]);
}

function findLabPartNumbers(instructions: string): number[] {
    return regex.matchAll(/Part ([0-9]+)/gi, instructions)
        .map(([, partNum]) => partNum)
        .map(e => parseInt(e))
        .let(t => [...new Set<number>(t)])
        .sort();
}

export const LabInstructions = {
    async from(path: string): Promise<LabInstructions> {
        const buffer = await fs.readFile(path);
        const instructions = buffer.toString();
        return {
            path,
            number: findLabNumber(instructions),
            partNumbers: findLabPartNumbers(instructions),
        };
    },
};

// (async () => {
//     await FileToCreate.of("tmp.txt", async () => {
//         return "Hello";
//     }).create();
// })();