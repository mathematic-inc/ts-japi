import { DataDocument } from '../interfaces/json-api.interface';
import { SerializerOptions } from '../interfaces/serializer.interface';
import JapiError from '../models/error.model';
import Relationship from '../models/relationship.model';
import ResourceIdentifier, { ResourceIdentifierOptions } from '../models/resource-identifier.model';
import Resource, { ResourceOptions } from '../models/resource.model';
import { Dictionary, nullish, SingleOrArray } from '../types/global.types';
import merge from '../utils/merge';
import { Helpers, recurseRelators } from '../utils/serializer.utils';
import Cache from './cache';
import Relator from './relator';

/**
 * The {@link Serializer} class is the main class used to serializer data
 * (you can use the {@link ErrorSerializer} class to serialize errors).
 *
 * Example:
 * ```typescript
 * [[include:serializer.example.ts]]
 * ```
 */
export default class Serializer<PrimaryType extends Dictionary<any> = any> {
  /**
   * Default options. Can be edited to change default options globally.
   */
  public static defaultOptions = {
    idKey: 'id',
    version: '1.0',
    onlyIdentifier: false,
    nullData: false,
    asIncluded: false,
    onlyRelationship: false,
    cache: false,
    depth: 0,
    include: 0,
    projection: null,
    linkers: {},
    metaizers: {},
  };

  /**
   * The name to use for the type.
   */
  public collectionName: string;

  /**
   * The set of options for the serializer.
   */
  private options: SerializerOptions<PrimaryType>;

  /**
   * The set of helper functions for the serializer
   */
  public helpers: Helpers<PrimaryType>;

  /**
   * Caching
   */
  public cache = new Cache<PrimaryType>();

  /**
   * Creates a {@link Serializer}.
   *
   * @param collectionName - The name of the collection of objects.
   * @param options - Options for the serializer.
   */
  public constructor(
    collectionName: string,
    options: Partial<SerializerOptions<PrimaryType>> = {}
  ) {
    // Setting default options.
    this.options = merge({}, Serializer.defaultOptions, options);

    this.helpers = new Helpers(this.options);
    if (this.options.cache && this.options.cache instanceof Cache) {
      this.cache = this.options.cache;
    }

    // Setting type name.
    this.collectionName = collectionName;
  }

  /**
   * Gets the {@link Relator}s associated with this serializer
   */
  public getRelators() {
    return this.helpers.relators;
  }

  /**
   * Sets the {@link Relator}s associated with this serializer
   */
  public setRelators(relators: SerializerOptions<PrimaryType>['relators']) {
    this.options.relators = relators;
    this.helpers = new Helpers(this.options);
  }

  /** @internal Generates a `ResourceIdentifier`. */
  public createIdentifier(data: PrimaryType, options?: SerializerOptions<PrimaryType>) {
    // Get options
    if (options === undefined) options = this.options;

    const identifierOptions: ResourceIdentifierOptions = {};

    if (options.metaizers.resource) {
      identifierOptions.meta = options.metaizers.resource.metaize(data);
    }

    return new ResourceIdentifier(data[options.idKey], this.collectionName, identifierOptions);
  }

  /** @internal Generates a `Resource`. */
  public async createResource(
    data: PrimaryType,
    options?: Partial<SerializerOptions<PrimaryType>>,
    helpers?: Helpers<PrimaryType>,
    relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>
  ) {
    // Get options
    if (options === undefined || helpers === undefined) {
      options = this.options;
      helpers = this.helpers;
    }
    if (!options.idKey) {
      throw new JapiError({ detail: 'options must provide a value for `idKey`' });
    }

    const resourceOptions: ResourceOptions<PrimaryType> = {};

    // Get ID before projections.
    const id = data[options.idKey];
    const type = this.collectionName;

    // Get attributes
    resourceOptions.attributes = helpers.projectAttributes(data);

    // Handling relators
    if (helpers.relators) {
      const relationships: Record<string, Relationship> = {};

      await Promise.all(
        Object.entries(helpers.relators).map(async ([name, relator]) => {
          let relatedDataCache: Dictionary<any>[] | undefined;
          if (relatorDataCache) {
            relatedDataCache = relatorDataCache.get(relator) || [];
            relatorDataCache.set(relator, relatedDataCache);
          }

          const relationship = await relator.getRelationship(data, relatedDataCache);
          if (relationship) {
            relationships[name] = relationship;
          }
        })
      );
      resourceOptions.relationships = relationships;
    }

    // Handling links
    if (options.linkers?.resource) {
      resourceOptions.links = { self: options.linkers.resource.link(data) };
    }

    if (options.metaizers?.resource) {
      resourceOptions.meta = options.metaizers.resource.metaize(data);
    }

    return new Resource<PrimaryType>(id, type, resourceOptions);
  }

  /**
   * The actual serialization function.
   *
   * @param data - Data to serialize.
   * @param options - Options to use at runtime.
   */
  public async serialize(
    data: SingleOrArray<PrimaryType> | nullish,
    options?: Partial<SerializerOptions<PrimaryType>>
  ) {
    // Merge options.
    let o = this.options;
    let h = this.helpers;

    if (options !== undefined) {
      o = merge({}, o, options);
      h = new Helpers(o);
    }

    const cache: Cache<PrimaryType> = o.cache instanceof Cache ? o.cache : this.cache;
    if (o.cache) {
      const storedDocument = cache.get(data, options);
      if (storedDocument) {
        return storedDocument;
      }
    }

    // Construct initial document and included data
    const document: Partial<DataDocument<PrimaryType>> = {};

    // Document versioning
    if (o.version) {
      document.jsonapi = { ...document.jsonapi, version: o.version };
    }

    if (o.metaizers.jsonapi) {
      document.jsonapi = { ...document.jsonapi, meta: o.metaizers.jsonapi.metaize() };
    }

    // Cache data fetched during resource creation
    const relatorDataCache: Map<Relator<any>, Dictionary<any>[]> = new Map();

    const keys: string[] = [];
    let wasSingle = false;
    let dto;
    let createIdentifier;
    let createResource;
    let relators;

    // Check if only a relationship is desired
    if (o.onlyRelationship) {
      // Validate options.
      if (h.relators === undefined) {
        throw new TypeError(`"relators" must be defined when using "onlyRelationship"`);
      }
      if (!data || Array.isArray(data)) {
        throw new TypeError(`Cannot serialize multiple primary datum using "onlyRelationship"`);
      }
      const relator = h.relators[o.onlyRelationship];
      if (relator === undefined) {
        throw new TypeError(
          `"onlyRelationship" is not the name of any collection name among the relators listed in "relators"`
        );
      }

      // Handle related data
      const relatedData = await relator.getRelatedData(data);

      // Handle related links
      const links = relator.getRelatedLinks(data, relatedData);
      if (links) document.links = links;

      // Handle related meta
      const meta = relator.getRelatedMeta(data, relatedData);
      if (meta) document.meta = meta;

      createIdentifier = (datum: any) => relator.getRelatedIdentifier(datum);
      createResource = async (datum: any) => {
        const resource = await relator.getRelatedResource(datum);
        keys.push(resource.getKey());
        return resource;
      };
      relators = relator.getRelatedRelators();
      dto = relatedData;
    } else {
      // Handle meta
      if (o.metaizers.document) {
        document.meta = o.metaizers.document.metaize(data);
      }

      // Handle links
      if (o.linkers.document) {
        document.links = { ...document.links, self: o.linkers.document.link(data) };
      }

      // Handle pagination links
      if (o.linkers.paginator) {
        const pagination = o.linkers.paginator.paginate(data as PrimaryType | PrimaryType[]);
        if (pagination) {
          document.links = { ...document.links, ...pagination };
        }
      }

      createIdentifier = (datum: PrimaryType) => this.createIdentifier(datum, o);
      createResource = async (datum: PrimaryType) => {
        const resource = await this.createResource(datum, o, h, relatorDataCache);
        keys.push(resource.getKey());
        return resource;
      };
      relators = h.relators;
      dto = data;
    }

    if (dto === undefined) {
      return cache.set(data, document, options);
    }

    if (o.nullData || dto === null) {
      document.data = null;
      return cache.set(data, document, options);
    }

    // Handle `onlyIdentifier` option
    if (o.onlyIdentifier) {
      document.data = Array.isArray(dto) ? dto.map(createIdentifier) : createIdentifier(dto);
      return cache.set(data, document, options);
    }

    if (!Array.isArray(dto)) {
      wasSingle = true;
      dto = [dto];
    }

    if (o.asIncluded) {
      document.data = dto.map(createIdentifier);
      document.included = await Promise.all(dto.map(createResource));
    } else {
      document.data = await Promise.all(dto.map(createResource));
    }
    const include = o.include || o.depth;
    if (relators && include) {
      document.included = (document.included || []).concat(
        await recurseRelators(dto, relators, include, keys, relatorDataCache)
      );
    }

    if (wasSingle) {
      document.data = (document.data as any[])[0];
    }

    return cache.set(data, document, options);
  }
}
