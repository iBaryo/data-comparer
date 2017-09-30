import {CompareFn, CompareInfo} from "./CompareInterfaces";
import {System} from "./Common";

export type CompareStrategy = 'linear'|'mesh';
export type CompareStrategyFn<T extends System, D> = (datas: Map<T, D>, compare: CompareFn<D>) => CompareInfo<T>[];

export const CompareStrategies = {
    linear: function<T extends System, D>(datas: Map<T, D>, compare: CompareFn<D>): CompareInfo<T>[] {
        const res: CompareInfo<T>[] = [];
        const systems = Array.from(datas.keys());
        for (let i = 0, j = 1; j < datas.size; ++i, ++j) {
            const sys1 = systems[i], sys2 = systems[j];
            res.push({
                sys1,
                sys2,
                result: compare(datas.get(sys1), datas.get(sys2))
            } as CompareInfo<T>);
        }
        return res;
    },
    mesh: function<T extends System, D>(datas: Map<T, D>, compare: CompareFn<D>): CompareInfo<T>[] {
        const res: CompareInfo<T>[] = [];
        const systems = Array.from(datas.keys());

        for (let i = 0; i < systems.length - 1; i++) {
            for (let j = i + 1; j < systems.length; j++) {
                const sys1 = systems[i], sys2 = systems[j];
                res.push({
                    sys1,
                    sys2,
                    result: compare(datas.get(sys1), datas.get(sys2))
                } as CompareInfo<T>);
            }
        }
        return res;
    }
};