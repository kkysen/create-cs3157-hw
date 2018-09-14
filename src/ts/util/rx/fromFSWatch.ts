import * as fs from "fs-extra";
import {PathLike} from "fs";
import {Observable} from "rxjs/index";
import {path} from "../polyfills/path";
import {fromListener} from "./fromListener";

export interface FSEvent {
    event: string;
    filename: string;
    path: string;
}

interface FSWatchOptions {
    encoding?: string | null,
    persistent?: boolean,
    recursive?: boolean
}

export const fromFSWatch = function(filename: string, options?: FSWatchOptions): Observable<FSEvent> {
    return fromListener<FSEvent>(async listener => {
        const {dir, base} = path.parse(filename);
        const stat = await fs.stat(filename);
        const parentDir = stat.isDirectory() ? path.join(dir, base) : dir;
        fs.watch(filename, options || null, (event, _filename) => {
            const filename = _filename as string;
            return listener({event, filename, path: path.join(parentDir, filename)});
        });
    });
};