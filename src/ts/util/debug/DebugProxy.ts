import {isString} from "../types/isType";

type DebugProxyOptions<T extends object> = Partial<{[K in keyof ProxyHandler<T>]: boolean}>;

export const DebugProxy = {
    
    for<T extends object>(target: T, options: DebugProxyOptions<T> = {}, name: string = "Target"): T {
        const handler: ProxyHandler<T> = {
            get: (target, p, receiver) => {
                if (!target._hasProperty(p) && (!isString(p) || !p.startsWith("__"))) {
                    throw new TypeError(
                        `${p.toString()} is not yet implemented on ${name} ${target}`);
                }
                return Reflect.get(target, p, receiver);
            },
        };
        for (const [key, value] of Object.entries(options)) {
            if (value === false) {
                handler[key] = undefined;
            }
        }
        return new Proxy(target, handler);
    },
    
};