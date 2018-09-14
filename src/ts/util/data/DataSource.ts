import {MaybePromise} from "../maybePromise/MaybePromise";

export type DataSource<T, Args> = (args: Args) => MaybePromise<ReadonlyArray<T>>;