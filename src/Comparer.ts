import {MultiQuery, SystemQuery, getSystemsData} from "./MultiQuery";
import {CompareStrategies, CompareStrategy, CompareStrategyFn} from "./CompareStrategies";
import {System} from "./Common";
import {CompareFn} from "./CompareInterfaces";


export abstract class Comparer<T extends System, D> extends MultiQuery<T> {
    protected abstract compare: CompareFn<D>;

    public compareSysData() {

    }
}

export async function compareSysData<T extends System, D>(systems: T[],
                                                          query: SystemQuery<T,D>,
                                                          compare: CompareFn<D>,
                                                          compareStrategy: CompareStrategy | CompareStrategyFn<T,D>) {

    if (!systems || systems.length < 2)
        throw 'no systems to compare';

    const queryRes = await getSystemsData<T,D>(systems, query);

    if (typeof compareStrategy == 'string') {
        compareStrategy = CompareStrategies[compareStrategy] as CompareStrategyFn<T,D>;
    }

    const compareRes = compareStrategy(queryRes.datas, compare);

    return {
        results: compareRes,
        queryErrors: queryRes.errors
    };
}