import {globalWindow} from "../window/globalWindow";
import Timer = NodeJS.Timer;

type Handler<T> = (event: T) => void;

const defaultInterval = 500;

export const multiEvent = function<T>(intervalMs: number = defaultInterval) {
    return (handler: Handler<T[]> | null, ...handlers: Handler<T[]>[]): Handler<T> => {
        type TimerId = number | Timer;
        type ClearTimer = (id: TimerId) => void;
        const setTimeout = globalWindow.setTimeout;
        const clearTimeout: ClearTimer = <ClearTimer> globalWindow.clearTimeout;
        const numHandlers = handlers.length;
        let events: T[] = [];
        let prev = 0;
        let timeoutId: number | Timer = 0;
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
                } else {
                    timeoutId = setTimeout(fire, intervalMs - interval);
                }
            };
        } else {
            switch (handlers.length) {
                case 0:
                    return () => {};
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
                        } else {
                            timeoutId = setTimeout(fire, intervalMs - interval);
                        }
                    };
            }
        }
    };
};

export const doubleEvent = function<T>(intervalMs: number = defaultInterval) {
    type H = Handler<T[]>;
    const multi = multiEvent<T>(intervalMs);
    return (single: Handler<[T]>, double: Handler<[T, T]>): Handler<T> =>
        multi(null, single as H, double as H);
};

export const tripleEvent = function<T>(intervalMs: number = defaultInterval) {
    type H = Handler<T[]>;
    const multi = multiEvent<T>(intervalMs);
    return (single: Handler<[T]>, double: Handler<[T, T]>, triple: Handler<[T, T, T]>): Handler<T> =>
        multi(null, single as H, double as H, triple as H);
};

