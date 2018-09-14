import {refreshableAsyncCache, RefreshableAsyncCacheGetter, RefreshableCacheType} from "../cache/cache";
import {All} from "../collections/query/All";
import {MaybePromise} from "../maybePromise/MaybePromise";
import {AwaitType, objectFields, Values} from "../object/objectFields";
import {isFunction} from "../types/isType";
import {ValueOrGetter} from "../types/ValueOrGetter";
import {DataSource} from "./DataSource";
import AwaitAll = objectFields.AwaitAll;
import AwaitFunctions = objectFields.AwaitFunctions;
import AwaitRefreshableCaches = objectFields.AwaitRefreshableCaches;

interface DataAccessorArgs<DataSources, T extends By, By, Parsed, Raw, Args> {
    
    source(sources: DataSources): DataSource<Raw, Args>;
    
    parse(raw: Raw): Parsed;
    
    preParsed?: (args: Args) => ReadonlyArray<Parsed>;
    
    create(parsed: Parsed, id: number, args: Args): T | undefined;
    
    by: By;
    
}

export type OriginalData<All, Parsed, Raw> = All & {
    readonly parsed: ReadonlyArray<Parsed>;
    readonly raw: ReadonlyArray<Raw>;
};

export type MappedData<All> = All;

type DataAccessor<DataSources, Data> = RefreshableAsyncCacheGetter<Data, DataSources>;

export type AccessDatum<T extends RefreshableAsyncCacheGetter<any, any>> = AwaitType<RefreshableCacheType<T>>;

export type AccessData<T extends Values<RefreshableAsyncCacheGetter<any, any>>> = {[K in keyof T]: AccessDatum<T[K]>};

interface DataAccessorClass<DataSources> {
    
    // f<Args>(): {[K in keyof Args]: RefreshableAsyncCacheGetter<Args[K], DataSources>};
    
    "new"<T extends By, By, Parsed, Raw, Args>(
        args: DataAccessorArgs<DataSources, T, By, Parsed, Raw, Args>,
        argsGetter: AwaitRefreshableCaches<Args, DataSources>,
    ): DataAccessor<DataSources, OriginalData<All<T, By>, Parsed, Raw>>;
    
    mapped<T extends By, By, Args>(
        create: (args: Args) => ReadonlyArray<T>,
        by: By,
        argsGetter: AwaitRefreshableCaches<Args, DataSources>,
    ): DataAccessor<DataSources, MappedData<All<T, By>>>;
    
    data<DataAccessors extends Values<RefreshableAsyncCacheGetter<any, any>>>(dataAccessors: DataAccessors):
        RefreshableAsyncCacheGetter<AccessData<DataAccessors>, ValueOrGetter<DataSources>>;
    
}

export const DataAccessorFactory = {
    
    for<DataSources>(): DataAccessorClass<DataSources> {
        return {
            
            new: ({source, parse, preParsed = () => [], create, by}, argsGetter) => {
                return refreshableAsyncCache(async (sources: DataSources) => {
                    const args = await objectFields.awaitRefreshableCaches(argsGetter, sources);
                    const raw = await source(sources)(args);
                    const parsed = raw.map(parse);
                    // do it twice so index is correct 2nd time
                    const a = [
                        ...parsed.filter((e, i) => create(e, i, args)),
                        ...preParsed(args),
                    ].mapFilter((e, i) => create(e, i, args));
                    return {
                        ...All.of(a, by),
                        parsed,
                        raw,
                    };
                });
            },
            
            mapped: (create, by, argsGetter) => {
                return refreshableAsyncCache(async (source: DataSources) => {
                    return All.of(create(await objectFields.awaitRefreshableCaches(argsGetter, source)), by);
                });
            },
            
            data: <DataAccessors extends Values<RefreshableAsyncCacheGetter<any, any>>>(dataAccessors: DataAccessors) => {
                type Data = AccessData<DataAccessors>;
                return refreshableAsyncCache((source: ValueOrGetter<DataSources>): MaybePromise<Data> => {
                    const _source = isFunction(source) ? source() : source;
                    const dataPromises = dataAccessors.mapFields<DataAccessors, AwaitAll<Data>>(e => e.get(_source));
                    return objectFields.awaitAll(dataPromises);
                }, () => Object.values(dataAccessors).forEach(e => e.refresh()));
            },
            
        };
    },
    
};