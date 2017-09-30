export interface System {
}

export type MaybePromise<T> = T|Promise<T>;

export function isPromise(obj): obj is Promise<any> {
    return typeof obj.then === 'function';
}