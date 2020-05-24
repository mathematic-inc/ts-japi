export function isObject(o: any): o is object {
 return typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]";
}
