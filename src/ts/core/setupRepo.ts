import * as fs from "fs-extra";
import {path} from "../util/polyfills/path";


async function cleanUpRepo(repoDir: string): Promise<void> {
    if (!(await fs.stat(repoDir)).isDirectory()) {
        throw new Error(`${repoDir} is not a directory`);
    }
    const {dir: parentDir, base: repoName} = path.parse(repoDir);
    const tempRepoDir = `${repoDir}~`;
    await fs.move(repoDir, tempRepoDir);
    await fs.mkdir(repoDir);
    const clonedRepoDir = path.join(repoDir, repoName);
    await fs.move(tempRepoDir, clonedRepoDir);
    await fs.move(path.join(clonedRepoDir, ".git"), path.join(repoDir, ".git"));
}

const toIgnore: string[] = [
    ".idea/",
    "CMakeLists.txt",
    "cmake-build-debug",
    "",
    "*.o",
    "*.exe",
];

async function populateRepo(repoDir: string): Promise<void> {
    const join = (filename: string) => path.join(repoDir, filename);
    await fs.writeFile(join(".gitignore"), toIgnore.join("\n"));
    await 
}

export async function setupRepo(repoDir: string): Promise<void> {
    await cleanUpRepo(repoDir);
    await populateRepo(repoDir);
}