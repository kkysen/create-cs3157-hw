import {exec, ExecOptions} from "child_process";

export interface ExitInfo {
    code: number;
    signal: string;
}

export function runCommand(command: string, options?: ExecOptions): Promise<ExitInfo> {
    return new Promise((resolve, reject) => {
        console.log(`running ${command}`);
        const process = exec(command, options, error => error && reject(error));
        process.on("close", (code, signal) => {
            console.log(`ran ${command}`);
            return resolve({code, signal});
        });
    });
}