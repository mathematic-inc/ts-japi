import Meta from '../models/meta.model';
import { Dictionary, VariadicFunction } from '../types/global.types';

/**
 * The {@link Metaizer} class is used to construct [meta information](https://jsonapi.org/format/#document-meta).
 *
 * Example:
 * ```typescript
 * [[include:metaizer.example.ts]]
 * ```
 */
export default class Metaizer<Dependencies extends any[]> {
  /** @internal Generates a {@link Meta}. */
  public metaize: VariadicFunction<Dependencies, Meta>;

  /**
   * Creates a {@link Metaizer}.
   *
   * @param metaize - A function to generate [meta information](https://jsonapi.org/format/#document-meta)
   * from its arguments.
   */
  public constructor(metaize: VariadicFunction<Dependencies, Dictionary<any>>) {
    this.metaize = (...datas: Dependencies) => new Meta(metaize(...datas));
  }
}
