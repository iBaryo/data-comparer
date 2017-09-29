export interface System {
}

export function isPromise(obj): obj is Promise<any> {
    return typeof obj.then === 'function';
}