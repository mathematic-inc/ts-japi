import { DataDocument } from "../interfaces/json:api.interface";
import { SerializerOptions } from "../interfaces/serializer.interface";
import Relationship from "../models/relationship.model";
import ResourceIdentifier, { ResourceIdentifierOptions } from "../models/resource-identifier.model";
import Resource, { ResourceOptions } from "../models/resource.model";
import { Dictionary, nullish, SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";
import Relator from "./relator";

/**
 * The {@linkcode Serializer} class is the main class used to serializer data
 * (you can use the {@linkcode ErrorSerializer} class to serialize errors).
 *
 * Example:
 * ```typescript
 * [[include:serializer.example.ts]]
 * ```
 */
export default class Serializer<PrimaryType extends Dictionary<any> = any, RelatedType = any> {
 /**
  * Default options. Can be edited to change default options globally.
  */
 public static defaultOptions = {
  idKey: "id",
  version: "1.0",
  onlyIdentifier: false,
  nullData: false,
  asIncluded: false,
  onlyRelationship: false,
  depth: 0,
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
 public options: SerializerOptions<PrimaryType>;

 /**
  * Creates a {@linkcode Serializer}.
  *
  * @param collectionName The name of the collection of objects.
  * @param options Options for the serializer.
  */
 public constructor(collectionName: string, options: Partial<SerializerOptions<PrimaryType>> = {}) {
  // Setting default options.
  this.options = merge({}, Serializer.defaultOptions, options);
  this.options.relators = this.normalizeRelators(this.options.relators);

  // Setting type name.
  this.collectionName = collectionName;
 }

 public getRelators() {
  return this.options.relators as Record<string, Relator<PrimaryType>> | undefined;
 }

 public setRelators(relators: SerializerOptions<PrimaryType>["relators"]) {
  this.options.relators = this.normalizeRelators(relators);
 }

 /** @internal Generates a `ResourceIdentifier`. */
 public createIdentifier(data: PrimaryType, options?: SerializerOptions<PrimaryType>) {
  // Get options
  if (!options) options = this.options;

  const identifierOptions: ResourceIdentifierOptions = {};

  if (options.metaizers.resource) {
   identifierOptions.meta = options.metaizers.resource.metaize(data);
  }

  return new ResourceIdentifier(data[options.idKey], this.collectionName, identifierOptions);
 }

 /** @internal Generates a `Resource`. */
 public async createResource(data: PrimaryType, options?: SerializerOptions<PrimaryType>) {
  // Get options
  if (!options) options = this.options;

  const resourceOptions: ResourceOptions<PrimaryType> = {};

  // Get ID before projections.
  const id = data[options.idKey];
  const type = this.collectionName;

  // Get attributes
  if (options.projection !== undefined) {
   if (options.projection === null) {
    resourceOptions.attributes = { ...data };
   } else {
    resourceOptions.attributes = {};
    type PrimaryKeys = Array<keyof PrimaryType>;
    const type = Object.values(options.projection)[0];
    if (type === 0) {
     for (const key of Object.keys(data) as PrimaryKeys) {
      if (!(key in options.projection)) {
       resourceOptions.attributes[key] = data[key];
      }
     }
    } else {
     for (const key of Object.keys(options.projection) as PrimaryKeys) {
      resourceOptions.attributes[key] = data[key];
     }
    }
   }
   delete resourceOptions.attributes[options.idKey];
  }

  // Handling relators
  if (options.relators) {
   const relationships: Record<string, Relationship> = {};
   await Promise.all(
    Object.entries(options.relators).map(async ([name, relator]) => {
     relationships[name] = await relator.getRelationship(data);
    })
   );
   resourceOptions.relationships = relationships;
  }

  // Handling links
  if (options.linkers.resource) {
   resourceOptions.links = { self: options.linkers.resource.link(data) };
  }

  if (options.metaizers.resource) {
   resourceOptions.meta = options.metaizers.resource.metaize(data);
  }

  return new Resource<PrimaryType>(id, type, resourceOptions);
 }

 public normalizeRelators(relators: SerializerOptions<PrimaryType>["relators"]) {
  const normalizedRelators: Record<string, Relator<PrimaryType>> = {};
  if (relators) {
   if (relators instanceof Relator) {
    normalizedRelators[relators.relatedName] = relators;
    return normalizedRelators;
   } else if (relators instanceof Array) {
    for (const relator of relators) {
     normalizedRelators[relator.relatedName] = relator;
    }
    return normalizedRelators;
   } else {
    return relators;
   }
  }
  return undefined;
 }

 /**
  * The actual serialization function.
  *
  * @param data Data to serialize.
  * @param options Options to use at runtime.
  */
 public async serialize(
  data: SingleOrArray<PrimaryType> | nullish,
  options?: Partial<SerializerOptions<PrimaryType>>
 ) {
  // Merge options.
  const o = options ? merge({}, this.options, options) : this.options;
  o.relators = this.normalizeRelators(o.relators);

  // Validate options.
  if (o.depth < 0) {
   throw new RangeError(`"depth" must be greater than or equal to 0`);
  }

  // Setting up locals
  const included = new Map<string, Resource>();
  const primary = new Map<string, Resource | ResourceIdentifier>();

  // Construct initial document and included data
  const document: DataDocument<PrimaryType> = {};

  // Document versioning
  if (o.version) {
   document.jsonapi = { ...document.jsonapi, version: o.version };
  }

  if (o.metaizers.jsonapi) {
   document.jsonapi = { ...document.jsonapi, meta: o.metaizers.jsonapi.metaize() };
  }

  let originallySingular = false;

  // Check if only a relationship is desired
  if (o.onlyRelationship) {
   // Validate options.
   if (o.relators === undefined) {
    throw new TypeError(`"relators" must be defined when using "onlyRelationship"`);
   }
   if (!data || Array.isArray(data)) {
    throw new TypeError(`Cannot serialize multiple primary datum using "onlyRelationship"`);
   }
   const relator = o.relators[o.onlyRelationship];
   if (o.relators[o.onlyRelationship] === undefined) {
    throw new TypeError(
     `"onlyRelationship" is not the name of any collection name among the relators listed in "relators"`
    );
   }

   // Handle related data
   let relatedData = await relator.getRelatedData(data);

   if (relatedData === undefined) {
    return document;
   }

   if (relatedData === null) {
    document.data = null;
    return document;
   }

   // Handle related links
   const links = relator.getRelatedLinks(data, relatedData);
   if (links) document.links = links;

   // Handle related meta
   const meta = relator.getRelatedMeta(data, relatedData);
   if (meta) document.meta = meta;

   // Normalize data
   if (!Array.isArray(relatedData)) {
    originallySingular = true;
    relatedData = [relatedData];
   }

   switch (true) {
    case o.onlyIdentifier: {
     relatedData.forEach((datum: PrimaryType) => {
      const identifier = relator.getRelatedIdentifier(datum);
      primary.set(identifier.getKey(), identifier);
     });
     break;
    }
    default: {
     if (o.asIncluded) {
      await Promise.all(
       relatedData.map(async (datum: PrimaryType) => {
        const resource = await relator.getRelatedResource(datum);
        included.set(resource.getKey(), resource);
       })
      );
      relatedData.forEach((datum: PrimaryType) => {
       const identifier = relator.getRelatedIdentifier(datum);
       primary.set(identifier.getKey(), identifier);
      });
     } else {
      await Promise.all(
       relatedData.map(async (datum: PrimaryType) => {
        const resource = await relator.getRelatedResource(datum);
        primary.set(resource.getKey(), resource);
       })
      );
     }
     const relators = relator.getRelatedRelators();
     if (relators) {
      await recurseRelators(relatedData, relators, o.depth - 1, included, primary);
     }
    }
   }
  } else {
   // Handle meta
   if (o.metaizers.document) {
    document.meta = o.metaizers.document.metaize(data);
   }

   // Handle links
   if (o.linkers.document) {
    document.links = { ...document.links, self: o.linkers.document.link(data) };
   }

   if (data === undefined) {
    return document;
   }

   if (o.nullData || data === null) {
    document.data = null;
    return document;
   }

   // Data-based document links
   if (o.linkers.paginator) {
    const pagination = o.linkers.paginator.paginate(data);
    if (pagination) {
     document.links = { ...document.links, ...o.linkers.paginator.paginate(data) };
    }
   }

   // Normalize data
   if (!Array.isArray(data)) {
    originallySingular = true;
    data = [data];
   }

   switch (true) {
    case o.onlyIdentifier: {
     data.forEach((datum) => {
      const identifier = this.createIdentifier(datum, o);
      primary.set(identifier.getKey(), identifier);
     });
     break;
    }
    default: {
     if (o.asIncluded) {
      await Promise.all(
       data.map(async (datum) => {
        const resource = await this.createResource(datum, o);
        included.set(resource.getKey(), resource);
       })
      );
      data.forEach((datum) => {
       const identifier = this.createIdentifier(datum, o);
       primary.set(identifier.getKey(), identifier);
      });
     } else {
      await Promise.all(
       data.map(async (datum) => {
        const resource = await this.createResource(datum, o);
        primary.set(resource.getKey(), resource);
       })
      );
     }
     const relators = o.relators;
     if (relators) {
      await recurseRelators(data, relators, o.depth, included, primary);
     }
    }
   }
  }

  if (included.size > 0) {
   document.included = [...included.values()];
  }
  document.data = originallySingular ? [...primary.values()][0] : [...primary.values()];

  return document;
 }
}

async function recurseRelators<T>(
 data: T[],
 relators: Record<string, Relator<T>>,
 depth: number,
 included: Map<string, Resource>,
 primary: Map<string, Resource | ResourceIdentifier>
) {
 if (depth <= 0) return;
 const queue: [Array<T>, Record<string, Relator<T>>][] = [[data, relators]];
 while (queue.length > 0 && depth-- > 0) {
  for (let i = 0, len = queue.length; i < len; i++) {
   const [data, relators] = queue[i];
   for (const relator of Object.values(relators)) {
    const relatedData = await Promise.all(data.map(relator.getRelatedData));
    const newData: Array<Dictionary<any>> = [];
    const newRelators = relator.getRelatedRelators();
    await Promise.all(
     relatedData.flat().map(async (datum) => {
      const resource = await relator.getRelatedResource(datum);
      const key = resource.getKey();
      if (!included.has(key) && !primary.has(key)) {
       newData.push(datum);
       included.set(key, resource);
      }
     })
    );
    if (newData.length > 0 && newRelators) {
     queue.push([newData, newRelators]);
    }
   }
  }
 }
}
