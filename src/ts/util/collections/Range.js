"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../window/anyWindow");
exports.Range = {
    new(from, to) {
        const _from = to === undefined ? 0 : from;
        const _to = to === undefined ? from : to;
        return {
            fill(t) {
                return [...new Array(_to - _from)].fill(t);
            },
            toArray() {
                return [...new Array(_to - _from)].map((e, i) => i + _from);
            },
            map(map) {
                return this.toArray().map(map);
            },
            filter(func) {
                return this.toArray().filter(func);
            },
            forEach(func) {
                for (let i = _from; i < _to; i++) {
                    func(i);
                }
            },
            toInterval() {
                return [_from, _to];
            },
            has(i) {
                return i >= _from && i < _to;
            },
        };
    },
    open(from, to) {
        return exports.Range.new(from + 1, to);
    },
    closed(from, to) {
        return exports.Range.new(from, to + 1);
    },
    ofDomain(domain) {
        return this.new(Math.min(...domain), Math.max(...domain));
    },
};
anyWindow_1.globals({ range: exports.Range });
//# sourceMappingURL=Range.js.map