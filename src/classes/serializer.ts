import { DataDocument } from "../interfaces/document.interface";
import { SerializerOptions } from "../interfaces/serializer.interface";
import ResourceIdentifier from "../models/resource-identifier.model";
import Resource from "../models/resource.model";
import { Dictionary, SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";
import Metaizer from "./metaizer";
import Relator from "./relator";
import { getArray } from "../utils/get-array";
import Relationship from "../models/relationship.model";

/**
 * The {@linkcode Serializer} class is the main class used to serializer data
 * (you can use the {@linkcode ErrorSerializer} class to serialize errors).
 *
 * Example:
 * ```typescript
 * [[include:serializer.example.ts]]
 * ```
 */
export default class Serializer<PrimaryType extends Dictionary<any>> {
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

  // Setting type name.
  this.collectionName = collectionName;
 }

 /** @internal Generates a `ResourceIdentifier`. */
 public constructResourceIdentity(
  data: PrimaryType,
  options: Partial<SerializerOptions<PrimaryType>> = {}
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
  options: Partial<SerializerOptions<PrimaryType>> = {}
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

  // Handle relationships
  const relationships: Record<string, Relationship> = {};
  if (o.relators) {
   const relators = getArray(o.relators);
   await Promise.all(
    relators.map((relator) => {
     const serializer = relator.getRelatedSerializer();
     if (serializer) {
      return relator
       .getRelationship(data)
       .then((rship) => (relationships[serializer.collectionName] = rship));
     } else return;
    })
   );
  }

  // Delete the ID field.
  delete attributes[o.idKey];

  return new Resource<PrimaryType>(
   {
    type: this.collectionName,
    id,
    attributes,
    relationships: Object.keys(relationships).length > 0 ? relationships : undefined,
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
  options: Partial<SerializerOptions<PrimaryType>> = {}
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

  // Setting up locals
  const includedData = new Map<string, Resource>();
  const primaryData = new Map<string, Resource | ResourceIdentifier>();

  // Construct initial document and included data
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
     for (const identifier of getIdentifiers(data)) {
      primaryData.set(`${identifier.type} ${identifier.id}`, identifier);
     }
     break;
    }
    case !!o.onlyRelationship: {
     // Validate options.
     if (o.relators === undefined) {
      throw new TypeError(`"relators" must be defined when using "onlyRelationship"`);
     }
     if (!originallySingular) {
      throw new TypeError(`Cannot serialize multiple primary datum using "onlyRelationship"`);
     }

     // Reset singularity option
     originallySingular = false;

     const relator = getArray(o.relators).find(
      (relator) => !!(relator.getRelatedSerializer()?.collectionName === o.onlyRelationship)
     );
     if (relator === undefined) {
      throw new TypeError(
       `"onlyRelationship" is not the name of any collection name among the relators listed in "relators"`
      );
     }
     const relationship = await relator.getRelationship(data[0]);
     if (relationship.links) {
      document.links = relationship.links;
     }
     if (relationship.meta) {
      document.meta = relationship.meta;
     }
     if (relationship.data) {
      if (!Array.isArray(relationship.data)) {
       originallySingular = true;
       relationship.data = [relationship.data];
      }
      for (const datum of relationship.data) {
       primaryData.set(`${datum.type} ${datum.id}`, datum);
      }
      await recurseResources(data);
     }
     break;
    }
    default: {
     const resources = await getResources(data);
     if (o.asIncluded) {
      for (const resource of resources) {
       includedData.set(`${resource.type} ${resource.id}`, resource);
      }
      for (const identifier of getIdentifiers(data)) {
       primaryData.set(`${identifier.type} ${identifier.id}`, identifier);
      }
     } else {
      for (const resource of resources) {
       primaryData.set(`${resource.type} ${resource.id}`, resource);
      }
     }
     await recurseResources(data);
    }
   }
  }

  if (includedData.size > 0) {
   document.included = [...includedData.values()];
  }
  if (primaryData.size > 0) {
   document.data = originallySingular ? [...primaryData.values()][0] : [...primaryData.values()];
  } else {
   document.data = originallySingular ? null : [];
  }

  return document;

  async function recurseResources(data: PrimaryType[]) {
   if (o.depth > 0 && o.relators) {
    const queue: [Array<Dictionary<any>>, Array<Relator<any>>][] = [[data, getArray(o.relators)]];
    let depth = o.depth;
    while (queue.length > 0 && depth-- > 0) {
     for (let i = 0, len = queue.length; i < len; i++) {
      const [data, relators] = queue[i];
      for (const relator of relators) {
       const serializer = relator.getRelatedSerializer();
       if (serializer === undefined) continue;
       const relatedData = (await Promise.all(data.map(relator.getRelatedData))).flat();
       if (relatedData.length > 0) {
        const newData = [];
        for (const datum of relatedData) {
         const uniqueId = `${serializer.collectionName} ${datum[serializer.options.idKey]}`;
         if (!includedData.has(uniqueId)) {
          if (
           !primaryData.has(uniqueId) ||
           primaryData.get(uniqueId) instanceof ResourceIdentifier
          ) {
           newData.push(datum);
           includedData.set(uniqueId, await serializer.constructResource(datum));
          }
         }
        }
        if (newData.length > 0 && serializer.options.relators) {
         queue.push([newData, getArray(serializer.options.relators)]);
        }
       }
      }
     }
    }
   }
  }
 }
}
