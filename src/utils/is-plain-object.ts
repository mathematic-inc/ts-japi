import { isObject } from "./is-object-object";

export function isPlainObject(o: any): o is object {
 if (!isObject(o)) return false;
 // If has modified constructor
 const ctor = o.constructor;
 if (typeof ctor !== "function") return false;
 // If has modified prototype
 const prot = ctor.prototype;
 if (!isObject(prot)) return false;
 // If constructor does not have an Object-specific method
 // eslint-disable-next-line no-prototype-builtins
 if (!prot.hasOwnProperty("isPrototypeOf")) return false;
 // Most likely a plain Object
 return true;
}
