import { DataDocument } from "../interfaces/document.interface";
import { SerializerOptions } from "../interfaces/serializer.interface";
import ResourceIdentifier from "../models/resource-identifier.model";
import Resource from "../models/resource.model";
import { Dictionary, SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";
import Metaizer from "./metaizer";
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
export default class Serializer<
 PrimaryType extends Dictionary<any>,
 RelatedType extends Dictionary<any> = Dictionary<any>
> {
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
 private options: Readonly<SerializerOptions<PrimaryType, RelatedType>>;

 /**
  * Creates a {@linkcode Serializer}.
  *
  * @param collectionName The name of the collection of objects.
  * @param options Options for the serializer.
  */
 public constructor(
  collectionName: string,
  options: Partial<SerializerOptions<PrimaryType, RelatedType>> = {}
 ) {
  // Setting default options.
  this.options = merge({}, Serializer.defaultOptions, options);

  // Setting type name.
  this.collectionName = collectionName;
 }

 /** @internal Generates a `ResourceIdentifier`. */
 public constructResourceIdentity(
  data: PrimaryType,
  options: Partial<SerializerOptions<PrimaryType, RelatedType>> = {}
 ) {
  // Merge options.
  const o = merge({}, this.options, options);

  return new ResourceIdentifier(
   { type: this.collectionName, id: data[o.idKey] },
   o.metaizers.resource ? o.metaizers.resource.metaize(data) : undefined
  );
 }

 /** @internal Generates a `Resource`. */
 public async constructResource(
  data: PrimaryType,
  options: Partial<SerializerOptions<PrimaryType, RelatedType>> = {}
 ) {
  // Merge options.
  const o = merge({}, this.options, options);

  // Get ID before projections.
  const id = data[o.idKey];

  // Get attributes
  const attributes: Partial<PrimaryType> = {};
  if (o.projection) {
   for (const [key, value] of Object.entries(data) as any[]) {
    if (o.projection[key]) attributes[key] = value;
   }
  } else {
   for (const [key, value] of Object.entries(data) as any[]) {
    attributes[key] = value;
   }
  }

  // Delete the ID field.
  delete attributes[o.idKey];

  return new Resource<PrimaryType>(
   {
    type: this.collectionName,
    id,
    attributes,
    relationships: o.relator ? await o.relator.getRelationship(data) : undefined,
    links: o.linkers.resource ? { self: o.linkers.resource.link(data) } : undefined,
   },
   o.metaizers.resource ? o.metaizers.resource.metaize(data) : undefined
  );
 }

 /**
  * The actual serialization function.
  *
  * @param data Data to serialize.
  * @param options Options to use at runtime.
  */
 public async serialize(
  data?: SingleOrArray<PrimaryType>,
  options: Partial<SerializerOptions<PrimaryType, RelatedType>> = {}
 ) {
  // Merge options.
  const o = merge({}, this.options, options);

  // Validate options.
  if (o.depth < 0) {
   throw new RangeError(`"depth" must be greater than or equal to 0`);
  }
  if (data === undefined && !(o.metaizers.document instanceof Metaizer)) {
   throw new TypeError(`Data or a "document" metaizer must be given`);
  }

  const document: DataDocument<PrimaryType> = {};

  // Constructing base document.
  document.jsonapi = { version: o.version };

  // Handling document metadata.
  if (o.metaizers.jsonapi) {
   document.jsonapi.meta = o.metaizers.jsonapi.metaize();
  }
  if (o.metaizers.document) {
   document.meta = o.metaizers.document.metaize(data);
  }

  // Handling document linkers
  if (o.linkers.document) {
   document.links = { ...document.links, self: o.linkers.document.link(data) };
  }

  // Constructing utility functions
  const getIdentifiers = (data: PrimaryType[]) => {
   return data.map((datum) => this.constructResourceIdentity(datum, o));
  };
  const getResources = (data: PrimaryType[]) => {
   return Promise.all(data.map((datum) => this.constructResource(datum, o)));
  };

  // Handling data.
  let originallySingular = false;
  if (data) {
   if (!Array.isArray(data)) {
    originallySingular = true;
    data = [data];
   }

   // Handling data-based document linkers
   if (o.linkers.paginator) {
    const pagination = o.linkers.paginator.paginate(data);
    if (pagination) {
     document.links = { ...document.links, ...o.linkers.paginator.paginate(data) };
    }
   }

   switch (true) {
    case o.nullData: {
     document.data = null;
     break;
    }
    case o.onlyIdentifier: {
     const resourceIdentifiers = getIdentifiers(data);
     document.data = originallySingular ? resourceIdentifiers[0] : resourceIdentifiers;
     break;
    }
    case o.onlyRelationship: {
     // Validate options.
     if (!(o.relator instanceof Relator)) {
      throw new TypeError(`"relator" must be defined when using "onlyRelationship"`);
     }
     if (!originallySingular) {
      throw new TypeError(`Cannot serialize multiple primary datum using "onlyRelationship"`);
     }

     const relationship = await o.relator.getRelationship(data[0]);
     if (relationship.links) {
      document.links = relationship.links;
     }
     if (relationship.meta) {
      document.meta = relationship.meta;
     }
     if (relationship.data) {
      document.data = relationship.data;
      await recurseResources(data);
     }
     break;
    }
    default: {
     const resources = await getResources(data);
     if (o.asIncluded) {
      const resourceIdentifiers = getIdentifiers(data);
      document.included = resources;
      document.data = originallySingular ? resourceIdentifiers[0] : resourceIdentifiers;
     } else {
      document.data = originallySingular ? resources[0] : resources;
     }
     await recurseResources(data);
    }
   }
  }

  return document;

  async function recurseResources(data: PrimaryType[]) {
   if (o.depth > 0) {
    document.included = document.included || [];
    let currentRelator: Relator<any, any> | undefined = o.relator,
     currentData: Dictionary<any>[] = data,
     currentDepth = o.depth;
    while (currentRelator && currentData && currentDepth-- >= -1) {
     const serializer = currentRelator.getRelatedSerializer();
     if (!serializer) break;
     const relatedData = await Promise.all(currentData.map(currentRelator.getRelatedData));
     const promises = [];
     currentData = relatedData.flat();
     for (const datum of currentData) {
      promises.push(serializer.constructResource(datum));
     }
     document.included = document.included.concat(await Promise.all(promises));
     currentRelator = serializer.options.relator;
    }
   }
  }
 }
}
