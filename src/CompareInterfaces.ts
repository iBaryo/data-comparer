import {System, MaybePromise} from "./Common";

export interface CompareResult {
    success: boolean;
}

export interface CompareInfo<T extends System> {
    sys1 : T,
    sys2 : T,
    result : MaybePromise<CompareResult>
}

export type CompareFn<D> = (data1: D, data2: D) => MaybePromise<CompareResult>;
