import Metaizer from '../classes/metaizer';

export interface LinkerOptions<Dependencies extends any[]> {
  /**
   * A {@link Metaizer} that gets the
   * [meta](https://jsonapi.org/format/#document-resource-object-relationships)
   * about the link.
   */
  metaizer?: Metaizer<Dependencies>;
}
