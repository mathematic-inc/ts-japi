/**
 * A utility type for describing a single object or an array of objects
 */
export type SingleOrArray<T> = T | T[];

/**
 * A function that takes several arguments and outputs something.
 *
 * @see {@link https://en.wikipedia.org/wiki/Variadic_function}
 */
export type VariadicFunction<Dependencies extends any[], ReturnType> = (
 ...dependencies: Dependencies
) => ReturnType;

export type Dictionary<T> = Record<string | number | symbol, T>;

export type nullish = null | undefined;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
 k: infer I
) => void
 ? I
 : never;
