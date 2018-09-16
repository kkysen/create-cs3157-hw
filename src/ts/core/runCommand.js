"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function runCommand(command, options) {
    return new Promise((resolve, reject) => {
        console.log(`running ${command}`);
        const process = child_process_1.exec(command, options, error => error && reject(error));
        process.on("close", (code, signal) => {
            console.log(`ran ${command}`);
            return resolve({ code, signal });
        });
    });
}
exports.runCommand = runCommand;
//# sourceMappingURL=runCommand.js.map