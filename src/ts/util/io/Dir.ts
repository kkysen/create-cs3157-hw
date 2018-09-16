import * as fs from "fs-extra";
import {path} from "../polyfills/path";
import {FileContents, FileToCreate} from "./FileToCreate";

export interface Dir extends FileToCreate {
    
    dir(dirName: string): Dir;
    
    file(fileName: string): string;
    
    fileToCreate(fileName: string, contents: FileContents): FileToCreate;
    
    ensureCreated(): this;
    
}

interface DirClass {
    
    createDir: (path: string) => Promise<void>;
    
    of(dirPath: string): Dir;
    
}

export const Dir: DirClass = {
    
    createDir: fs.mkdir,
    
    of(dirPath: string): Dir {
        const file = (fileName: string) => path.join(dirPath, fileName);
        const _: Dir = {
            path: dirPath,
            dir: dirName => Dir.of(file(dirName)),
            file,
            create: () => fs.mkdir(dirPath),
            fileToCreate: (fileName, contents) => FileToCreate.of(file(fileName), contents),
            ensureCreated: () => ({
                ..._,
                create: () => fs.ensureDir(dirPath),
            }),
        };
        return _;
    },
    
};