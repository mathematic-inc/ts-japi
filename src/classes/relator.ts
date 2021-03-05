import { RelatorOptions } from '../interfaces/relator.interface';
import { SerializerOptions } from '../interfaces/serializer.interface';
import Link from '../models/link.model';
import Meta from '../models/meta.model';
import Relationship, { RelationshipOptions } from '../models/relationship.model';
import ResourceIdentifier from '../models/resource-identifier.model';
import Resource from '../models/resource.model';
import { Dictionary, nullish } from '../types/global.types';
import merge from '../utils/merge';
import { Helpers } from '../utils/serializer.utils';
import Serializer from './serializer';

/**
 * The {@linkcode Relator} class is used to generate top-level [included data](https://jsonapi.org/format/#document-top-level)
 * as well as resource-level [relationships](https://jsonapi.org/format/#document-resource-object-relationships).
 *
 * Example:
 * ```typescript
 * [[include:relator.example.ts]]
 * ```
 */
export default class Relator<PrimaryType, RelatedType extends Dictionary<any> = any> {
  /**
   * Default options. Can be edited to change default options globally.
   */
  public static defaultOptions = {
    linkers: {},
  };

  /**
   * Options for relator.
   */
  private options: RelatorOptions<PrimaryType, RelatedType>;

  public relatedName: string;
  /**
   * Creates a {@linkcode Relator}.
   *
   * @param fetch Fetches related data from primary data.
   * @param serializer The `Serializer` to use for related data.
   * @param options Options for the relator.
   */
  public constructor(
    fetch: (data: PrimaryType) => Promise<RelatedType | RelatedType[] | nullish>,
    serializer: Serializer<RelatedType>,
    options: Partial<RelatorOptions<PrimaryType, RelatedType>> = {}
  ) {
    // Setting default options
    this.relatedName = serializer.collectionName;
    this.options = merge({}, Relator.defaultOptions, options);
    this.getRelatedData = fetch;
    this.getRelatedResource = serializer.createResource.bind(serializer);
    this.getRelatedIdentifier = serializer.createIdentifier.bind(serializer);
    this.getRelatedRelators = serializer.getRelators.bind(serializer);
  }

  /** @internal Gets related data from primary data. */
  public getRelatedData: (data: PrimaryType) => Promise<RelatedType | RelatedType[] | nullish>;

  /** @internal Gets related relators */
  public getRelatedRelators: () => Record<string, Relator<RelatedType, any>> | undefined;

  /** @internal Creates related identifiers */
  public getRelatedIdentifier: (
    data: RelatedType,
    options?: SerializerOptions<RelatedType> | undefined
  ) => ResourceIdentifier;

  /** @internal Creates related resources */
  public getRelatedResource: (
    data: RelatedType,
    options?: SerializerOptions<RelatedType>,
    helpers?: Helpers<RelatedType>,
    relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>
  ) => Promise<Resource<RelatedType>>;

  /** @internal Gets related links from primary data and related data */
  public getRelatedLinks(data: PrimaryType, relatedData: RelatedType | RelatedType[] | nullish) {
    let links: Dictionary<Link | nullish> | undefined;
    if (this.options.linkers.relationship) {
      links = { ...links, self: this.options.linkers.relationship.link(data, relatedData) };
    }
    if (this.options.linkers.related) {
      links = { ...links, related: this.options.linkers.related.link(data, relatedData) };
    }
    return links;
  }

  /** @internal Gets related meta from primary data and related data */
  public getRelatedMeta(data: PrimaryType, relatedData: RelatedType | RelatedType[] | nullish) {
    let meta: Meta | undefined;
    if (this.options.metaizer) {
      meta = this.options.metaizer.metaize(data, relatedData);
    }
    return meta;
  }

  /** @internal Creates a {@linkcode Relationship}. */
  public async getRelationship(data: PrimaryType, relatedDataCache?: Dictionary<any>[]) {
    // Initialize options.
    const relationshipOptions: RelationshipOptions = {};

    // Get related data.
    const relatedData = await this.getRelatedData(data);
    if (relatedData && relatedDataCache) {
      relatedDataCache.push(...(Array.isArray(relatedData) ? relatedData : [relatedData]));
    }

    // Get related links.
    const links = this.getRelatedLinks(data, relatedData);
    if (links) relationshipOptions.links = links;

    // Construct related resources.
    if (relatedData !== undefined) {
      if (relatedData === null) {
        relationshipOptions.data = null;
      } else {
        relationshipOptions.data = Array.isArray(relatedData)
          ? relatedData.map((data) => this.getRelatedIdentifier(data))
          : this.getRelatedIdentifier(relatedData);
      }
    }

    // Get meta.
    const meta = this.getRelatedMeta(data, relatedData);
    if (meta) relationshipOptions.meta = meta;

    return new Relationship(relationshipOptions);
  }
}
