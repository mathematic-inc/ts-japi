import type { Dictionary, UnionToIntersection } from "../types/global.types";
import { isPlainObject } from "./is-plain-object";

/**
 * Deep merge two objects over their enumerable properties.
 *
 * @param target - The object to merge into
 * @param source - The objects to use for merging
 */
export default function merge<T extends Dictionary<any>, U extends Dictionary<any>[]>(
  target: T,
  ...sources: U
): T & UnionToIntersection<U[number]>;
export default function merge<T extends Dictionary<unknown>>(
  target: T,
  ...sources: readonly Readonly<Dictionary<unknown>>[]
): T {
  for (const source of sources) {
    if (!isPlainObject(target) || !isPlainObject(source)) {
      continue;
    }
    for (const key of Object.keys(source)) {
      const sourceItem = source[key];
      if (!isPlainObject(sourceItem)) {
        Object.assign(target, { [key]: sourceItem });
        continue;
      }
      const targetItem = target[key];
      if (isPlainObject(targetItem)) {
        merge(targetItem, sourceItem);
      } else if (
        targetItem === undefined ||
        targetItem === null ||
        targetItem === false ||
        targetItem === 0 ||
        targetItem === ""
      ) {
        Object.assign(target, { [key]: merge({}, sourceItem) });
      }
    }
  }
  return target;
}
