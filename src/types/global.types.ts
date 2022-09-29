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

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, ...0[]];

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
    }[keyof T]
  : '';
