"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regex;
(function (regex_1) {
    regex_1.toSource = function (regExp) {
        const { source, flags } = regExp;
        return `/${source}/${flags}`;
    };
    regex_1.join = function (...regexes) {
        const source = regexes.map(e => e.source).join("");
        const flagChars = regexes.map(e => e.flags).join("").split("");
        const flags = flagChars && [...new Set(flagChars)].join("");
        return new RegExp(source, flags);
    };
    regex_1.matchAll = function (regex, s) {
        if (!regex.global) {
            throw new Error("trying to matchAll with non global regex");
        }
        const matches = [];
        let match;
        while (match = regex.exec(s)) {
            matches.push(match);
        }
        return matches;
    };
})(regex = exports.regex || (exports.regex = {}));
//# sourceMappingURL=regex.js.map