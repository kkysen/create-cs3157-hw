"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Range_1 = require("../collections/Range");
exports.groupByOrdinal = function (a, group, numGroups) {
    const groups = Range_1.Range.new(numGroups).map(() => []);
    for (let i = 0; i < a.length; i++) {
        const e = a[i];
        groups[group(e, i)].push(e);
    }
    return groups;
};
exports.groupByNumber = function (a, group) {
    const groups = [];
    for (let i = 0; i < a.length; i++) {
        const e = a[i];
        const groupNum = group(e, i);
        const _group = groups[groupNum];
        if (_group) {
            _group.push(e);
        }
        else {
            groups[groupNum] = [e];
        }
    }
    return groups;
};
exports.groupByString = function (a, group) {
    const groups = {};
    for (let i = 0; i < a.length; i++) {
        const e = a[i];
        const groupName = group(e, i);
        const _group = groups[groupName];
        if (_group) {
            _group.push(e);
        }
        else {
            groups[groupName] = [e];
        }
    }
    return groups;
};
exports.groupBy = function (a, group) {
    const groups = new Map();
    for (let i = 0; i < a.length; i++) {
        const e = a[i];
        const groupName = group(e, i);
        const _group = groups.get(groupName);
        if (_group) {
            _group.push(e);
        }
        else {
            groups.set(groupName, [e]);
        }
    }
    return groups;
};
//# sourceMappingURL=groupBy.js.map