"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function anyInput() {
    return new Promise((resolve, reject) => {
        // process.stdin.once("error", reject);
        process.stdin.once("data", resolve);
    });
}
exports.anyInput = anyInput;
//# sourceMappingURL=AwaitAnyInput.js.map