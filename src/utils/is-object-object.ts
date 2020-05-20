export function isObject(o: any) {
 return typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]";
}
