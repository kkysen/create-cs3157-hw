"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashSet_1 = require("../collections/HashSet");
const hashEquals_1 = require("./hashEquals");
exports.sparseTranspose = function (a) {
    return a.map(({ i, j, value }) => ({ i: j, j: i, value }));
};
const reconstructUsingHashNew = function (flat, hashJ, newJ) {
    return [...new Set(flat.map(e => e.i).map(hashJ))]
        .sort()
        .map(h => ({
        i: newJ(h),
        row: flat.mapFilter(({ i, j, value }) => hashJ(i) === h && ({ j, value })),
    }));
};
const reconstructUsingHash = function (flat, hashJ) {
    const { hash, equals } = hashEquals_1.hashEquals.fromHash(hashJ);
    return [...HashSet_1.HashSet.new({
            elements: flat.map(e => e.i),
            hashEquals: { hash, equals },
        })]
        .sortBy(hash)
        .map(_i => ({
        i: _i,
        row: flat.mapFilter(({ i, j, value }) => equals(i, _i) && ({ j, value })),
    }));
};
exports.sparseTreeTranspose = function (a, hashJ, newJ) {
    const flatA = a.flatMap(({ i, row }) => row.map(({ j, value }) => ({ i, j, value })));
    const flatB = exports.sparseTranspose(flatA);
    if (newJ) {
        return reconstructUsingHashNew(flatB, hashJ, newJ);
    }
    else {
        return reconstructUsingHash(flatB, hashJ);
    }
};
//# sourceMappingURL=sparseTranspose.js.map