import {System} from "./Common";
import {compareSysData, SystemsCompareResult} from "./compareSysData";
import {SystemQuery} from "./QueryInterfaces";
import {CompareFn, CompareInfo, CompareResult} from "./CompareInterfaces";
import {CompareStrategy, CompareStrategyFn} from "./CompareStrategies";

export class Validator<T extends System> {
    constructor(protected _systems: T[]) {
    }

    public validate<D>(options: {
        query: SystemQuery<T,D>,
        compare: CompareFn<D>,
        strategy: CompareStrategy | CompareStrategyFn<T,D>
    }) : Promise<SystemsCompareResult<T>> {
        return compareSysData<T,D>(
            this._systems,
            options.query,
            options.compare,
            options.strategy
        );
    }
}