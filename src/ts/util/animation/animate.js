"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animationFrame = function () {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
};
exports.animate = function (animator) {
    let stop = false;
    (async () => {
        for (let i = 0; !stop; i++) {
            await exports.animationFrame();
            animator(i);
        }
    })();
    return () => {
        stop = true;
    };
};
//# sourceMappingURL=animate.js.map