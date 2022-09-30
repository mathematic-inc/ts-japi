import { PaginationOf } from '../interfaces/paginator.interface';
import Link from '../models/link.model';
import { SingleOrArray } from '../types/global.types';

/**
 * The {@link Paginator} class is used to construct [pagination links](https://jsonapi.org/format/#fetching-pagination).
 *
 * Example:
 * ```typescript
 * [[include:paginator.example.ts]]
 * ```
 */
export default class Paginator<DataType> {
  /** @internal Generates pagination links. */
  public paginate: (data: SingleOrArray<DataType>) => PaginationOf<Link> | void;

  /**
   * Creates a {@link Paginator}.
   *
   * @param paginate - A function to generate pagination links from data.
   */
  public constructor(paginate: (data: SingleOrArray<DataType>) => PaginationOf<string> | void) {
    this.paginate = (data: SingleOrArray<DataType>): PaginationOf<Link> | void => {
      const links = paginate(data);
      if (!links) return;
      return {
        first: typeof links.first === 'string' ? new Link(links.first) : links.first,
        last: typeof links.last === 'string' ? new Link(links.last) : links.last,
        prev: typeof links.prev === 'string' ? new Link(links.prev) : links.prev,
        next: typeof links.next === 'string' ? new Link(links.next) : links.next,
      };
    };
  }
}
