import { isObject } from './is-object';

export function isPlainObject(o: unknown): o is Record<string, unknown> {
  if (!isObject(o)) return false;
  // If constructor was modified
  if (typeof o.constructor !== 'function') return false;
  // If prototype was modified
  if (!isObject(o.constructor.prototype)) return false;
  // eslint-disable-next-line no-prototype-builtins
  if (!o.constructor.prototype.hasOwnProperty('isPrototypeOf')) return false;
  return true;
}
