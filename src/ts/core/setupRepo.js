"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path_1 = require("../util/polyfills/path");
async function cleanUpRepo(repoDir) {
    if (!(await fs.stat(repoDir)).isDirectory()) {
        throw new Error(`${repoDir} is not a directory`);
    }
    const { dir: parentDir, base: repoName } = path_1.path.parse(repoDir);
    const tempRepoDir = `${repoDir}~`;
    await fs.move(repoDir, tempRepoDir);
    await fs.mkdir(repoDir);
    const clonedRepoDir = path_1.path.join(repoDir, repoName);
    await fs.move(tempRepoDir, clonedRepoDir);
    await fs.move(path_1.path.join(clonedRepoDir, ".git"), path_1.path.join(repoDir, ".git"));
}
const toIgnore = [
    ".idea/",
    "CMakeLists.txt",
    "cmake-build-debug",
    "",
    "*.o",
    "*.exe",
];
async function populateRepo(repoDir) {
    const join = (filename) => path_1.path.join(repoDir, filename);
    await fs.writeFile(join(".gitignore"), toIgnore.join("\n"));
    await ;
}
async function setupRepo(repoDir) {
    await cleanUpRepo(repoDir);
    await populateRepo(repoDir);
}
exports.setupRepo = setupRepo;
//# sourceMappingURL=setupRepo.js.map