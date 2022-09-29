import Cache from '../classes/cache';
import Linker from '../classes/linker';
import Metaizer from '../classes/metaizer';
import Paginator from '../classes/paginator';
import Relator from '../classes/relator';
import { Dictionary, nullish, Paths, SingleOrArray } from '../types/global.types';

export interface SerializerOptions<PrimaryType extends Dictionary<any> = any> {
  /**
   * The key name for the identifier in the resource.
   *
   * @defaultValue `"id"`
   */
  idKey: keyof PrimaryType;

  /**
   * The highest JSON API version supported. Set to `null` to omit version.
   *
   * @defaultValue `1.0`
   */
  version: string | null;

  /**
   * Enables caching of documents. If a {@link Cache} is given, then the
   * given {@link Cache} will be used.
   *
   * @defaultValue `false`
   */
  cache: boolean | Cache<PrimaryType>;

  /**
   * Whether to use `null` value the `data` field.
   *
   * This option will ignore options
   * {@link SerializerOptions.onlyIdentifier | onlyIdentifier},
   * {@link SerializerOptions.linkers | linkers.resource}, and
   * {@link SerializerOptions.metaizers | metaizers.resource}
   * (and all options they ignores).
   *
   * @defaultValue `false`
   */
  nullData: boolean;

  /**
   * Whether to only serialize the identifier.
   *
   * This option will ignore the options
   * {@link SerializerOptions.include | depth}
   *
   * @defaultValue `false`
   */
  onlyIdentifier: boolean;

  /**
   * This is used to serialize the [resource linkages](https://jsonapi.org/format/#document-resource-object-linkage)
   * only. The value must be the name of a collection for a relator in the
   * {@link SerializerOptions.relators | relators} option.
   *
   * Only a single primary datum (as opposed to an array) **MUST**
   * be serialized.
   *
   * This option will ignore the options
   * {@link SerializerOptions.projection | projection},
   * {@link SerializerOptions.linkers | linkers.resource}, and
   * {@link SerializerOptions.metaizers | metaizers.resource}.
   */
  onlyRelationship: string;

  /**
   * Whether to make primary data as an [included resource](https://jsonapi.org/format/#document-compound-documents)
   * and use [resource identifier objects](https://jsonapi.org/format/#document-resource-identifier-objects) for
   * [top-level data](https://jsonapi.org/format/#document-top-level).
   *
   * @defaultValue `false`
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
   * @defaultValue `0`
   * @deprecated Replaced by `include`
   */
  depth: number;

  /**
   * Which resources to include. See [docs](https://jsonapi.org/format/#fetching-includes)
   *
   * If passed as a numeric value, all related resources will be included up to the given depth.
   *
   * If provided this will superceed the use of `depth`
   * If not provided, or explicitly nullish, then behaviour will default to using `depth`
   * If provided as an empty array, then no relationships will be included.
   */
  include: number | Paths<PrimaryType>[] | string[];

  /**
   * An object of 0 *OR* 1 (**NOT BOTH**) to denote hide or show attributes respectively.
   *
   * If set (directly) to `undefined`, then the `attributes` field will be left `undefined`.
   * If set to `null`, then every attribute will show.
   * If set to `{}`, then every attribute will hide.
   *
   * @defaultValue `null`
   */
  projection: Partial<Record<keyof PrimaryType, 0 | 1>> | null | undefined;

  /**
   * A {@link Relator} that generates `relationships` for a given primary resource.
   *
   * *Note*: You can add more relators by using {@link Serializer.setRelators}. This is useful in
   * case you have a cycle of relators among serializers.
   *
   * See [relationships objects](https://jsonapi.org/format/#document-resource-object-relationships)
   * for more information.
   */
  relators?:
    | Relator<PrimaryType>
    | Array<Relator<PrimaryType>>
    | Record<string, Relator<PrimaryType>>;

  /**
   * A set of options for constructing [top-level links](https://jsonapi.org/format/#document-top-level).
   */
  linkers: {
    /**
     * A {@link Linker} that gets represents a [top-level self link](https://jsonapi.org/format/#document-top-level).
     */
    document?: Linker<[SingleOrArray<PrimaryType> | nullish]>;

    /**
     * A {@link Linker} that represents a [resource-level self link](https://jsonapi.org/format/#document-resource-objects).
     */
    resource?: Linker<[PrimaryType]>;

    /**
     * A {@link Paginator} to use for [pagination links](https://jsonapi.org/format/#fetching-pagination).
     */
    paginator?: Paginator<PrimaryType>;
  };

  /**
   * A dictionary of {@link Metaizer}s to use in different locations of the document.
   */
  metaizers: {
    /**
     * Constructs metadata for the [JSON:API Object](https://jsonapi.org/format/#document-jsonapi-object).
     */
    jsonapi?: Metaizer<[]>;

    /**
     * Constructs metadata for the [top level](https://jsonapi.org/format/#document-top-level).
     */
    document?: Metaizer<[SingleOrArray<PrimaryType> | nullish]>;

    /**
     * Constructs metadata for the [resource objects](https://jsonapi.org/format/#document-resource-objects)
     */
    resource?: Metaizer<[PrimaryType]>;
  };
}
