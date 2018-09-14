"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFields = function (obj, mapper) {
    const mapped = {};
    for (const [key, value] of Object.entries(obj)) {
        mapped[key] = mapper(value);
    }
    return mapped;
};
//# sourceMappingURL=mapFields.js.map