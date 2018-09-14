"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = function (word) {
    return word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1);
};
exports.joinWords = function (words) {
    const _words = [...words];
    switch (_words.length) {
        case 0:
            return "";
        case 1:
            return _words[0];
        case 2:
            return _words[0] + " and " + _words[1];
        default:
            const lastWord = _words.pop();
            return _words.join(", ") + ", and " + lastWord;
    }
};
exports.camelCase = (() => {
    // from react-faux-dom/lib/utils/camelCase.js
    const hyphenPattern = /-+([a-z])/gi;
    return function (s) {
        hyphenPattern.lastIndex = 0;
        return s.replace(hyphenPattern, (match, c, offset) => {
            return offset === 0 ? c : c.toUpperCase();
        });
    };
})();
exports.separateClassName = function (className) {
    return className.replace(/([A-Z])/g, " $1").trim();
};
exports.separateFunctionName = function (functionName) {
    const [first, ...rest] = exports.separateClassName(functionName).split(" ");
    return [exports.capitalize(first), ...rest].join(" ");
};
exports.singletonAsArray = function (singletonOrArray) {
    return Array.isArray(singletonOrArray) ? singletonOrArray : [singletonOrArray];
};
exports.filterInput = function (input, charFilter) {
    input.value = input.value.split("").filter(charFilter).join("");
};
/**
 * Check if a single character string is a allowDigits.
 *
 * @param {string} char a single character string
 * @returns {boolean} if the character is a allowDigits 0-9
 */
exports.isDigit = function (char) {
    return !Number.isNaN(parseInt(char));
};
exports.onlyDigitsInput = function (input) {
    exports.filterInput(input, exports.isDigit);
};
exports.sleep = function (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
const regExpLiteralPattern = /\/([^\/]+)\/([gimuy]*)/;
exports.isRegExpLiteral = function (regex) {
    return regExpLiteralPattern.test(regex);
};
exports.parseRegExpLiteral = function (regex) {
    const match = regExpLiteralPattern.exec(regex);
    if (match) {
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    }
    else {
        return undefined;
    }
};
exports.escapeRegExp = function (literal, flags) {
    return new RegExp(literal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), flags);
};
class NotImplementedError extends Error {
}
exports.NotImplementedError = NotImplementedError;
exports.lowerBound = function (min, n) {
    return Math.max(min, n);
};
exports.upperBound = function (max, n) {
    return Math.min(max, n);
};
exports.bound = function (min, max, n) {
    return exports.lowerBound(min, exports.upperBound(max, n));
};
exports.boundSurrounding = function (min, max, center, halfSize) {
    return [exports.lowerBound(min, center - halfSize), exports.upperBound(max, center + halfSize)];
};
exports.snippet = function (s, center, halfSize) {
    const [start, end] = exports.boundSurrounding(0, s.length, center, halfSize);
    return s.slice(start, end);
};
exports.boolAsInt = function (bool) {
    return bool ? 1 : 0;
};
exports.moduloIndexer = function (a) {
    return i => a[i % a.length];
};
/**
 * Make an array non-holey.
 *
 * @param {T[]} a holey array
 * @returns {T[]} a blasphemous array
 */
exports.makeBlasphemous = function (a) {
    return Object.values(a);
};
//# sourceMappingURL=utils.js.map