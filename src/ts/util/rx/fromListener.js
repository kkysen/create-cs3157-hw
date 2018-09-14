"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("rxjs/index");
exports.fromListener = function (addListener) {
    const observable = new index_1.Subject();
    addListener(e => observable.next(e));
    return observable;
};
//# sourceMappingURL=fromListener.js.map