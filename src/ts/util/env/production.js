"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const when_1 = require("../misc/when");
const process = (global || window).process;
const nodeEnv = process && process.env && process.env.NODE_ENV;
exports.production = !nodeEnv ? false : nodeEnv.toLowerCase() === "production";
exports.development = !exports.production;
exports.inProduction = when_1.when(exports.production);
exports.inDevelopment = when_1.when(exports.development);
//# sourceMappingURL=production.js.map