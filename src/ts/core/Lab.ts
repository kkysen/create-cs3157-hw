import * as fs from "fs-extra";
import {Range} from "../util/collections/Range";
import {Dir} from "../util/io/Dir";
import {Creator, FileToCreate} from "../util/io/FileToCreate";
import {capitalize} from "../util/misc/utils";
import {path} from "../util/polyfills/path";
import {LabInstructions} from "./LabInstructions";
import {runCommand} from "./runCommand";

type FilesToCreate = {[key: string]: FileToCreate};

enum LabFile {
    GIT = ".git",
    GITIGNORE = ".gitignore",
    README = "README.txt",
    CMAKE_LISTS = "CMakeLists.txt",
    MAKEFILE = "Makefile",
    IDEA = ".idea",
    CMAKE_BUILD_DEBUG = "cmake-build-debug",
    OBJECT_FILES = "*.o",
    EXE_FILES = "*.exe",
}

interface LabPartFiles extends FilesToCreate {
    readonly cMakeListsTxt: FileToCreate;
    readonly makeFile: FileToCreate;
}

interface LabPart {
    readonly number: number;
    readonly name: string;
    readonly fullName: string;
    readonly dir: Dir;
    readonly files: LabPartFiles;
}

interface LabFiles extends LabPartFiles {
    readonly git: Dir;
    readonly gitIgnore: FileToCreate;
    readonly readMe: FileToCreate;
    readonly instructions: FileToCreate;
    readonly clonedRepo: Dir;
}

export interface Lab extends Creator {
    readonly number: number;
    readonly name: string;
    readonly dir: Dir;
    readonly parts: ReadonlyArray<LabPart>;
    readonly files: LabFiles;
    readonly submit: () => Promise<void>;
}

interface RemoteOptions {
    readonly username: string;
    readonly url: string;
    readonly parentDir: string;
}

interface LabDirOptions {
    readonly parentDir?: string;
    readonly remote?: Partial<RemoteOptions>;
}

export interface LabOptions extends LabDirOptions {
    readonly number: number;
    readonly numParts: number;
    readonly instructionsPath: string;
}

export interface LabFromInstructionsOptions extends LabDirOptions {
    readonly instructionsPath: string;
}

function filesCreator(files: FilesToCreate): () => Promise<void> {
    return () => Object.values(files).asyncForEach(file => file.create());
}

function remoteOptions(
    {
        username = "ks3343",
        url = "clac.cs.columbia.edu",
        parentDir = "~/cs3157",
    }: Partial<RemoteOptions>): RemoteOptions {
    return {username, url, parentDir};
}

export const Lab = {
    
    new(options: LabOptions): Lab {
        const {
            number,
            numParts,
            instructionsPath,
            parentDir: parentDirPath = "/mnt/c/Users/Khyber/workspace/AdvancedProgramming",
            remote: {
                username: remoteUsername = "ks3343",
                url: remoteUrl = "clac.cs.columbia.edu",
                parentDir: remoteParentDir = "~/cs3157",
            } = {},
        } = options;
        
        const name = `lab${number}`;
        const labName = name;
        const parentDir = Dir.of(parentDirPath);
        const dir = parentDir.dir(name);
        const labDir = dir;
        
        const instructionsFileName = `Lab ${number} Instructions.txt`;
        
        const cMakeListsTxt = (name: string) => [
            "cmake_minimum_required(VERSION 3.9)",
            "set(CMAKE_C_STANDARD 11)",
            `project(${name} C)`,
            "",
            "set(SOURCE_FILES\n)",
            "",
            `add_executable(${name} \${SOURCE_FILES})`,
        ].join("\n");
        
        const parts = Range.new(numParts)
            .map(number => {
                const name = `part${number}`;
                const fullName = `${labName}_${name}`;
                const dir = labDir.dir(name);
                return {
                    number,
                    name,
                    fullName,
                    dir,
                    files: {
                        cMakeListsTxt: dir.fileToCreate("CMakeLists.txt", cMakeListsTxt(fullName)),
                        makeFile: dir.fileToCreate("Makefile", () => [
                            "CC = gcc",
                            "CFLAGS = -std=c11 -g -ggdb -Wall -Werror -Wextra -O3 -march=native -flto",
                            "LFLAGS = -g -flto",
                            "LDFLAGS = -lm",
                            "",
                            "MAIN = main",
                            "",
                            "all: \${MAIN}",
                            "",
                            "",
                            "\${MAIN}: ",
                            "",
                            "",
                            "clean:\n\trm -rf *.o \${MAIN}",
                            "",
                        ].join("\n")),
                    },
                };
            });
        
        const files: LabFiles = {
            cMakeListsTxt: dir.fileToCreate(LabFile.CMAKE_LISTS, cMakeListsTxt(name)),
            makeFile: dir.fileToCreate(LabFile.MAKEFILE, () => {
                const partNames = parts.map(part => part.name);
                const addPrefix = (prefix: string) => (name: string) => `${prefix}${capitalize(name)}`;
                const prefixParts = (prefix: string) => partNames.map(addPrefix(prefix)).join(" ");
                const rule = (prefix: string, command: string = prefix) =>
                    (name: string) => `${addPrefix(prefix)(name)}:\n\tcd ${name}; make ${command}`;
                return [
                    `all: ${prefixParts("make")}`,
                    `clean: ${prefixParts("clean")}`,
                    ...partNames.map(rule("make", "all")),
                    ...partNames.map(rule("clean")),
                    "",
                ].join("\n\n");
            }),
            git: dir.dir(LabFile.GIT).ensureCreated(),
            gitIgnore: dir.fileToCreate(LabFile.GITIGNORE, () =>
                [
                    LabFile.IDEA,
                    LabFile.CMAKE_LISTS,
                    LabFile.CMAKE_BUILD_DEBUG,
                    instructionsFileName,
                    "",
                    LabFile.OBJECT_FILES,
                    LabFile.EXE_FILES,
                ].join("\n")),
            // TODO check README extension .txt or .md
            readMe: dir.fileToCreate("README.txt", () =>
                [
                    "Khyber Sen",
                    "UNI: ks3343",
                    `Lab ${number}`,
                    "",
                    "_".repeat(80),
                    "",
                    "Description of Solution",
                    "",
                    "My code works exactly as specified in the lab.",
                    "",
                    ...parts.map(part => `Part ${part.number}\n\n    \n\n`),
                ].join("\n")),
            instructions: dir.fileToCreate(instructionsFileName, async () => {
                return (await fs.readFile(instructionsPath)).toString();
            }),
            clonedRepo: dir.dir("skeleton").ensureCreated(),
        };
        
        const createParts = async () => {
            await parts.asyncForEach(async part => {
                await part.dir.create();
                await filesCreator(part.files)();
            });
        };
        
        const createFiles = async () => {
            await filesCreator(files)();
            await createParts();
        };
        
        const cleanUp = async () => {
            const tempDir = `${dir.path}~`;
            await fs.move(dir.path, tempDir);
            await fs.mkdir(dir.path);
            await fs.move(tempDir, files.clonedRepo.path);
            await fs.move(files.clonedRepo.dir(".git").path, files.git.path);
        };
        
        const remoteName = `${remoteUsername}@${remoteUrl}:`;
        const remoteDir = `${remoteParentDir}/${name}`;
        
        const clone = async () => {
            const command = `git clone ${remoteName}/home/jae/cs3157-pub/${name} ${dir.path}`;
            // git clone ks3343@clac.cs.columbia.edu:/home/jae/cs3157-pub/labN labN
            await runCommand(command);
        };
        
        const clean = () => runCommand("make clean", {cwd: dir.path});
        
        const sync = async (toRemote: boolean) => {
            const local = dir.path;
            const remote = `${remoteName}${remoteDir}`;
            const command = `scp -r ${toRemote ? local : remote} ${toRemote ? remote : local}`;
            // scp ${dir} ks3343@clac.cs.columbia.edu:${remoteDir}
            await runCommand(command);
        };
        
        const submit = async () => {
            const remoteCommands = [
                `/home/w3157/submit/submit-lab ${name}`,
            ];
            const command = `echo "${remoteCommands.join(" && ")}" | ssh ${remoteName}${remoteDir}`;
            // echo "command" | ssh ks3343@clac.cs.columbia.edu:${remoteDir}
            await runCommand(command);
        };
        
        return {
            number,
            name,
            dir,
            parts,
            files,
            create: async () => {
                await clone();
                await cleanUp();
                await createFiles();
            },
            submit: async () => {
                await clean();
                await sync(true);
                // don't run remote submit, I'll do that myself
                // await submit();
            },
        };
    },
    
    async fromInstructions(options: LabFromInstructionsOptions): Promise<Lab> {
        const {instructionsPath, parentDir, remote} = options;
        const {number, numParts} = await LabInstructions.from(instructionsPath);
        return Lab.new({
            number,
            numParts,
            instructionsPath,
            parentDir,
            remote,
        });
    },
    
};