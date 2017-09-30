import {System, isPromise, MaybePromise} from "./Common";

export type SystemQuery<T, D> =  (sys: T) => MaybePromise<D>;

export interface QueryError {
}

export interface QueryResult<T extends System, D> {
    datas: Map<T, D>,
    errors: Map<T, QueryError>
}

export class MultiQuery<T extends System> {
    constructor(protected _systems: T[]) {
    }

    public getSysData<D>(query: SystemQuery<T,D>) {
        return getSystemsData<T, D>(this._systems, query);
    }
}

export async function getSystemsData<T extends System, D>(systems: T[], query: SystemQuery<T, D>) {
    const res = {
        datas: new Map<T, D>(),
        errors: new Map<T, QueryError>()
    } as QueryResult<T, D>;

    for (const sys of systems) {
        try {
            let data = query(sys);
            if (isPromise(data)) {
                data = await data;
            }

            res.datas.set(sys, data);
        }
        catch (e) {
            res.errors.set(sys, e);
        }
    }

    return res;
}