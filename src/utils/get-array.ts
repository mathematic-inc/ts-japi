export function getArray<T>(obj: T | T[] | undefined) {
 if (obj) {
  if (Array.isArray(obj)) {
   return obj;
  } else {
   return [obj];
  }
 } else {
  return undefined;
 }
}
