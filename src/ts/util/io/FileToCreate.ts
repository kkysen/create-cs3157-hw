import * as fs from "fs-extra";
import {MaybePromise} from "../maybePromise/MaybePromise";
import {isFunction} from "../types/isType";

export interface Creator {
    readonly create: () => Promise<void>;
}

export interface FileToCreate extends Creator {
    
    readonly path: string;
    
}

export type FileContents = string | (() => MaybePromise<string>);

export const FileToCreate = {
    
    of(path: string, contents: FileContents): FileToCreate {
        return {
            path,
            create: async () => {
                const _isFunction = isFunction;
                const data: MaybePromise<string> = !isFunction(contents) ? contents : contents();
                return await fs.writeFile(path, await data);
            },
        };
    }
    
};