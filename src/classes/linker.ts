import { LinkerOptions } from '../interfaces/linker.interface';
import Link from '../models/link.model';
import { VariadicFunction } from '../types/global.types';

/**
 * The {@link Linker} class is used to construct a [link](https://jsonapi.org/format/#document-links).
 *
 * Example:
 * ```typescript
 * [[include:linker.example.ts]]
 * ```
 */
export default class Linker<Dependencies extends any[]> {
  /** @internal Generates a {@link Link}. */
  public link: VariadicFunction<Dependencies, Link>;

  /**
   * Creates a {@link Linker}.
   *
   * @param link - A {@link LinkFunction} used to generate a string URI from its arguments.
   * @param options - Options for the linker.
   */
  public constructor(
    link: VariadicFunction<Dependencies, string>,
    options: LinkerOptions<Dependencies> = {}
  ) {
    this.link = (...datas: Dependencies) => {
      return options.metaizer
        ? new Link(link(...datas), options.metaizer.metaize(...datas))
        : new Link(link(...datas));
    };
  }
}
