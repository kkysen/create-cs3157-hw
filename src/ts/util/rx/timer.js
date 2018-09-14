"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/internal/operators");
exports.startTimer = function (label) {
    return operators_1.tap(() => console.time(label));
};
exports.endTimer = function (label) {
    return operators_1.tap(() => console.timeEnd(label));
};
exports.timer = function (label) {
    return {
        start: exports.startTimer(label),
        end: exports.endTimer(label),
    };
};
//# sourceMappingURL=timer.js.map