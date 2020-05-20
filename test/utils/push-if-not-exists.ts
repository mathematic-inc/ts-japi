export function pushIfNotExists<T>(array: T[], element: T, predicate: (value: T) => unknown) {
 let idx = array.findIndex(predicate);
 idx > -1 ? (array[idx] = element) : array.push(element);
 return array.length;
}
