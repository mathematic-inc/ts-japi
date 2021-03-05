import { Dictionary, UnionToIntersection } from '../types/global.types';
import { isPlainObject } from './is-plain-object';

/**
 * Deep merge two objects over their enumerable properties.
 *
 * @param target The object to merge into
 * @param source The objects to use for merging
 */
export default function merge<T extends Dictionary<any>, U extends Dictionary<any>[]>(
  target: T,
  ...sources: U
): T & UnionToIntersection<U[number]> {
  if (!sources.length) return target as T & UnionToIntersection<U[number]>;
  const source = sources.shift();

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key of Object.keys(source)) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}
