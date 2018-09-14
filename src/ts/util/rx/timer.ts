import {tap} from "rxjs/internal/operators";

export const startTimer = function(label: string) {
    return tap(() => console.time(label));
};

export const endTimer = function(label: string) {
    return tap(() => console.timeEnd(label));
};

interface Timer {
    readonly start: ReturnType<typeof startTimer>;
    readonly end: ReturnType<typeof endTimer>;
}

export const timer = function(label: string): Timer {
    return {
        start: startTimer(label),
        end: endTimer(label),
    };
};