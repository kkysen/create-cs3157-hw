import * as fs from "fs-extra";
import {addExtensions} from "../util/extensions/allExtensions";
import {Dir} from "../util/io/Dir";
import {Lab} from "./Lab";

addExtensions();

async function asyncMain(): Promise<void> {
    Dir.createDir = fs.ensureDir; // don't overwrite
    const lab = await Lab.fromInstructions({
        instructionsPath: "/mnt/c/Users/Khyber/Downloads/03-lab1.txt",
        parentDir: "/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test",
    });
    await lab.create();
    await lab.submit();
}

function main(): void {
    (async () => {
        try {
            await asyncMain();
        } catch (e) {
            console.error(e);
        }
    })();
    // Dir.createDir = fs.ensureDir; // don't overwrite
    // TODO implement better merge
    const lab = Lab.new({
        number: 1,
        numParts: 3,
        instructionsPath: "/mnt/c/Users/Khyber/Downloads/03-lab1.txt",
        parentDir: "/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test",
    });
}

main();