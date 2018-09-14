"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalWindow_1 = require("../window/globalWindow");
const defaultInterval = 500;
exports.multiEvent = function (intervalMs = defaultInterval) {
    return (handler, ...handlers) => {
        const setTimeout = globalWindow_1.globalWindow.setTimeout;
        const clearTimeout = globalWindow_1.globalWindow.clearTimeout;
        const numHandlers = handlers.length;
        let events = [];
        let prev = 0;
        let timeoutId = 0;
        if (handler) {
            const fire = () => {
                handler(events);
                events = [];
                prev = performance.now();
            };
            return event => {
                timeoutId && clearTimeout(timeoutId);
                events.push(event);
                const now = performance.now();
                if (events.length === 1) {
                    prev = now;
                }
                const interval = now - prev;
                prev = now;
                if (interval > intervalMs) {
                    fire();
                }
                else {
                    timeoutId = setTimeout(fire, intervalMs - interval);
                }
            };
        }
        else {
            switch (handlers.length) {
                case 0:
                    return () => { };
                case 1:
                    const handler = handlers[0];
                    return event => handler([event]);
                default:
                    let numEvents = events.length;
                    const fire = () => {
                        handlers[numEvents - 1](events);
                        events = [];
                    };
                    return event => {
                        timeoutId && clearTimeout(timeoutId);
                        events.push(event);
                        numEvents = events.length;
                        const now = performance.now();
                        if (numEvents === 1) {
                            prev = now;
                        }
                        const interval = now - prev;
                        prev = now;
                        if ((interval > intervalMs) || numEvents === numHandlers) {
                            fire();
                        }
                        else {
                            timeoutId = setTimeout(fire, intervalMs - interval);
                        }
                    };
            }
        }
    };
};
exports.doubleEvent = function (intervalMs = defaultInterval) {
    const multi = exports.multiEvent(intervalMs);
    return (single, double) => multi(null, single, double);
};
exports.tripleEvent = function (intervalMs = defaultInterval) {
    const multi = exports.multiEvent(intervalMs);
    return (single, double, triple) => multi(null, single, double, triple);
};
//# sourceMappingURL=multiEvent.js.map