import {addExtensions} from "../util/extensions/allExtensions";
import {setupRepo} from "./setupRepo";

addExtensions();

export function main(): void {
    (async () => {
        await setupRepo("/mnt/c/Users/Khyber/workspace/AdvancedProgramming/test");
    })();
}

main();