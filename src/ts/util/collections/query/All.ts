export type By<T, By = {}> = {
    
    index(index: number): T | undefined;
    
} & {[K in keyof By]: (by: By[K]) => T | undefined};


export interface All<T extends _By, _By> {
    
    readonly all: ReadonlyArray<T>;
    
    readonly by: By<T, _By>;
    
}

export const All = {
    
    of<T extends By, By = {}>(a: ReadonlyArray<T>, bySample: By): All<T, By> {
        type K = keyof By;
        type V = By[K];
        type M = Map<V, T>;
        type GetBy = (by: V) => T | undefined;
        type AllGetBy = {[_K in K]: (by: By[_K]) => T | undefined}
        
        const map = (key: K): M => new Map(a.map(e => [e[key], e] as [V, T]));
        const mapBy = (key: K): GetBy => {
            const byMap = map(key);
            return (by: V) => byMap.get(by);
        };
        
        const maps = Object.keys<By>(bySample)
            .map(key => [key, mapBy(key)] as [K, GetBy]);
        const byMap: AllGetBy = maps.toObject();
        
        return {
            all: a,
            by: Object.assign(byMap, {
                index: (i: number) => a[i],
            }),
        };
    },
    
};