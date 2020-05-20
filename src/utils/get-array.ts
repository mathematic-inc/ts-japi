export function getArray<T>(obj: T | T[]) {
 return Array.isArray(obj) ? obj : [obj];
}
