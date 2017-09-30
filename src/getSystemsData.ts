import {System, isPromise } from "./Common";
import {SystemQuery, QueryError, QueryResult} from "./QueryInterfaces";

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