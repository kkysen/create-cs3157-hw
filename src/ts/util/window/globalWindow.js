"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("./anyWindow");
exports.globalWindow = anyWindow_1.isBrowser ? window : global;
//# sourceMappingURL=globalWindow.js.map