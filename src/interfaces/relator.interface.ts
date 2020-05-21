import Linker from "../classes/linker";
import Metaizer from "../classes/metaizer";
import Serializer from "../classes/serializer";
import { SingleOrArray, Dictionary } from "../types/global.types";

export interface RelatorOptions<PrimaryType, RelatedType> {
 /**
  * The `Serializer` to use for related data.
  */
 serializer?: Serializer<RelatedType>;

 /**
  * A dictionary of {@linkcode Linker}s to use for constructing links.
  *
  * @see {@link https://jsonapi.org/format/#document-resource-object-relationships | Resource object relationships} for more information.
  */
 linkers: {
  /**
   * A {@linkcode Linker} that gets the [self link](https://jsonapi.org/format/#document-resource-object-relationships)
   * between the primary data and the (array of) related data.
   */
  relationship?: Linker<[PrimaryType, SingleOrArray<RelatedType>]>;

  /**
   * A {@linkcode Linker} that gets the [related link](https://jsonapi.org/format/#document-resource-object-relationships)
   * between the primary data and the (array of) related data.
   */
  related?: Linker<[PrimaryType, SingleOrArray<RelatedType>]>;
 };

 /**
  * A {@linkcode Metaizer} that gets the
  * [meta](https://jsonapi.org/format/#document-resource-object-relationships)
  * about the relationship.
  */
 metaizer?: Metaizer<[PrimaryType, SingleOrArray<RelatedType>]>;
}
