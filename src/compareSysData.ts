import {getSysData} from "./getSysData";
import {CompareStrategies, CompareStrategy, CompareStrategyFn} from "./CompareStrategies";
import {System} from "./Common";
import {CompareFn} from "./CompareInterfaces";
import {QueryResult, SystemQuery} from "./QueryInterfaces";

export async function compareSysData<T extends System, D>(systems: T[],
                                                          query: SystemQuery<T,D>,
                                                          compare: CompareFn<D>,
                                                          compareStrategy: CompareStrategy | CompareStrategyFn<T,D>,
                                                          _getSystemsData: (systems: T[], query: SystemQuery<T, D>) => Promise<QueryResult<T, D>> = getSysData) {


    if (!systems || systems.length < 2)
        throw 'no systems to compare';

    if (typeof compareStrategy == 'string')
        compareStrategy = CompareStrategies[compareStrategy] as CompareStrategyFn<T,D>;

    if (!compareStrategy)
        throw 'missing compare strategy';

    const queryRes = await _getSystemsData(systems, query);

    const compareRes = compareStrategy(queryRes.datas, compare);

    return {
        results: compareRes,
        queryErrors: queryRes.errors
    };
}