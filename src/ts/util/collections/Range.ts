import {globals} from "../window/anyWindow";

export interface Range {
    
    map<T>(map: (i: number) => T): T[];
    
    filter(filter: (i: number) => boolean): number[];
    
    forEach(func: (i: number) => void): void;
    
    fill<T>(t: T): T[];
    
    toArray(): number[];
    
    toInterval(): number[];
    
    has(i: number): boolean;
    
    every(func: (i: number) => boolean): boolean;
    
    some(func: (i: number) => boolean): boolean;
    
}

export type RangeClass = {
    
    "new"(to: number): Range;
    
    "new"(from: number, to: number): Range;
    
    open(from: number, to: number): Range;
    
    closed(from: number, to: number): Range;
    
    ofDomain(domain: number[]): Range;
    
};

export const Range: RangeClass = {
    
    new(from: number, to?: number): Range {
        const _from: number = to === undefined ? 0 : from;
        const _to: number = to === undefined ? from : to;
        
        const _: Range = {
            fill: t => [...new Array(_to - _from)].fill(t),
            toArray: () => [...new Array(_to - _from)].map((e, i) => i + _from),
            map: map => _.toArray().map(map),
            filter: func => _.toArray().filter(func),
            forEach: func => {
                for (let i: number = _from; i < _to; i++) {
                    func(i);
                }
            },
            toInterval: () => [_from, _to],
            has: i => i >= _from && i < _to,
            every: func => _.toArray().every(func),
            some: func => _.toArray().some(func),
        };
        return _;
    },
    
    open(from: number, to: number): Range {
        return Range.new(from + 1, to);
    },
    
    closed(from: number, to: number): Range {
        return Range.new(from, to + 1);
    },
    
    ofDomain(domain: number[]): Range {
        return this.new(Math.min(...domain), Math.max(...domain));
    },
    
};

globals({range: Range});