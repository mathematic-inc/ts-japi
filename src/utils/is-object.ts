export function isObject(o: unknown): o is Record<string, unknown> {
 return typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]";
}
