import Linker from "../classes/linker";
import Metaizer from "../classes/metaizer";
import Paginator from "../classes/paginator";
import Relator from "../classes/relator";
import { Dictionary, SingleOrArray } from "../types/global.types";

export interface SerializerOptions<
 PrimaryType extends Dictionary<any>,
 RelatedType extends Dictionary<any>
> {
 /**
  * The key name for the identifier in the resource.
  *
  * @default `"id"`
  */
 idKey: string;

 /**
  * The highest JSON API version supported.
  *
  * @default `1.0`
  */
 version: string;

 /**
  * Whether to use `null` value the `data` field.
  *
  * This option will ignore options
  * {@linkcode SerializerOptions.onlyIdentifier | onlyIdentifier} and
  * {@linkcode SerializerOptions.metaizers | metaizers.resource}
  * (and all options they ignores).
  *
  * @default `false`
  */
 nullData: boolean;

 /**
  * Whether to only serialize the identifier.
  *
  * This option will ignore the options
  * {@linkcode SerializerOptions.onlyRelationship | onlyRelationship},
  * {@linkcode SerializerOptions.depth | depth}, and
  * {@linkcode SerializerOptions.relator | relator} (and all options they ignore
  * except {@linkcode SerializerOptions.linkers | linkers.resource}
  * and {@linkcode SerializerOptions.metaizers | metaizers.resource}).
  *
  * @default `false`
  */
 onlyIdentifier: boolean;

 /**
  * Whether to only serialize the [resource linkages](https://jsonapi.org/format/#document-resource-object-linkage)
  * obtained from primary data.
  *
  * A {@linkcode SerializerOptions.relator | relator} option **MUST** be
  * defined, and only a single primary datum (as opposed to an array) **MUST**
  * be serialized.
  *
  * This option will ignore the options
  * {@linkcode SerializerOptions.projection | projection},
  * {@linkcode SerializerOptions.asIncluded | asIncluded},
  * {@linkcode SerializerOptions.linkers | linkers.resource}, and
  * {@linkcode SerializerOptions.metaizers | metaizers.resource}.
  */
 onlyRelationship: boolean;

 /**
  * Whether to make primary data as an [included resource](https://jsonapi.org/format/#document-compound-documents)
  * and use [resource identifier objects](https://jsonapi.org/format/#document-resource-identifier-objects) for
  * [top-level data](https://jsonapi.org/format/#document-top-level).
  */
 asIncluded: boolean;

 /**
  * Determines the depth of `relator`s to use for [included resources](https://jsonapi.org/format/#document-compound-documents).
  *
  * **PLEASE TAKE CAUTION**: If this property is `Infinity`, performance can
  * degrade **significantly**. It is *RECOMMENDED* to use more requests rather
  * than a single one if such depth is required since included resources can be
  * **inhomogenous** thus difficult to traverse.
  *
  * Must be a number in `[0, Infinity]`.
  *
  * @default `0`
  */
 depth: number;

 /**
  * An object of 0 and 1 to denote hide and show of attributes respectively.
  * Every attribute hides by default, but if `undefined`, then all attributes
  * will show.
  */
 projection?: Partial<Record<keyof PrimaryType, 0 | 1>>;

 /**
  * A {@linkcode Relator} that generates `relationships` for a given primary resource.
  *
  * See [relationships objects](https://jsonapi.org/format/#document-resource-object-relationships) for more information.
  */
 relator?: Relator<PrimaryType, RelatedType>;

 /**
  * A set of options for constructing [top-level links](https://jsonapi.org/format/#document-top-level).
  */
 linkers: {
  /**
   * A {@linkcode Linker} that gets represents a [top-level self link](https://jsonapi.org/format/#document-top-level).
   */
  document?: Linker<[SingleOrArray<PrimaryType> | undefined]>;

  /**
   * A {@linkcode Linker} that represents a [resource-level self link](https://jsonapi.org/format/#document-resource-objects).
   */
  resource?: Linker<[PrimaryType]>;

  /**
   * A {@linkcode Paginator} to use for [pagination links](https://jsonapi.org/format/#fetching-pagination).
   */
  paginator?: Paginator<PrimaryType>;
 };

 /**
  * A dictionary of {@linkcode Metaizer}s to use in different locations of the document.
  */
 metaizers: {
  /**
   * Constructs metadata for the [JSON:API Object](https://jsonapi.org/format/#document-jsonapi-object).
   */
  jsonapi?: Metaizer<[]>;

  /**
   * Constructs metadata for the [top level](https://jsonapi.org/format/#document-top-level).
   */
  document?: Metaizer<[SingleOrArray<PrimaryType> | undefined]>;

  /**
   * Constructs metadata for the [resource objects](https://jsonapi.org/format/#document-resource-objects)
   */
  resource?: Metaizer<[PrimaryType]>;
 };
}
