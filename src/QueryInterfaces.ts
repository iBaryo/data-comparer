import {System, MaybePromise} from "./Common";
export type SystemQuery<T, D> =  (sys: T) => MaybePromise<D>;

export interface QueryError {
}

export interface QueryResult<T extends System, D> {
    datas: Map<T, D>,
    errors: Map<T, QueryError>
}