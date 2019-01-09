import {readableToString} from "@rauschma/stringio";
import {spawn} from "child_process";
import * as fs from "fs-extra";
import {Range} from "../util/collections/Range";
import {addExtensions} from "../util/extensions/allExtensions";
import {Dir} from "../util/io/Dir";
import {Lab} from "./Lab";

addExtensions();

async function findInstructionsPath(labNumber: number,
                                    dirPath: string = "/mnt/c/Users/Khyber/Downloads"): Promise<string | undefined> {
    const dir = Dir.of(dirPath);
    const files = await dir.ls();
    const file = files.find(file => file.endsWith(`-lab${labNumber}.txt`));
    return file && dir.file(file);
}

async function asyncMain(): Promise<void> {
    Dir.createDir = fs.ensureDir; // don't overwrite
    const labNumber: number = parseInt(process.argv[2]);
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
    const lab = await Lab.fromInstructions({
        instructionsPath,
        // parentDir: "/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test",
    });
    await lab.create();
    // await lab.submit();
}

async function misc(): Promise<void> {
    const outputs = await Range.new(100)
        .fill("./main")
        .map(cmd => spawn(cmd))
        .map(child => child.stdout)
        .asyncMap(stdout => readableToString(stdout));
    const outputLines = Range.new(10000).map(() => new Set());
    outputs.map(s => s.split("\n"))
        .forEach(lines => lines.forEach((line, i) => outputLines[i].add(line)));
    outputLines.mapFilter((lines, i) => lines.size > 1 && {i, lines})
        .map(({i, lines}) => ({i, n: lines.size}))
        .forEach(e => console.log(e));
}

function main(): void {
    (async () => {
        try {
            // await misc();
            await asyncMain();
        } catch (e) {
            console.error(e);
        }
    })();
}

main();