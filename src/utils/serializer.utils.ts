import Relator from "../classes/relator";
import { SerializerOptions } from "../interfaces/serializer.interface";

export async function recurseRelators(
 data: any[],
 relators: Record<string, Relator<any>>,
 depth: number,
 keys: string[]
) {
 const included: any[] = [];
 const mainQueue: [any[], Array<Relator<any>>][][] = [[[data, Object.values(relators)]]];
 while (depth-- > 0) {
  const subQueue = mainQueue.shift()!;
  const newQueue: [any[], Array<Relator<any>>][] = [];
  while (subQueue.length > 0) {
   const [data, relators] = subQueue.shift()!;
   for (let i = 0, len = relators.length; i < len; i++) {
    const relator = relators[i];
    const relatedData = await Promise.all(data.map(relator.getRelatedData));
    const newRelators = relator.getRelatedRelators();
    const newData: any[] = [];
    await Promise.all(
     relatedData
      .flat()
      .filter((d) => d !== null)
      .map(async (datum) => {
       const resource = await relator.getRelatedResource(datum);
       const key = resource.getKey();
       if (!keys.includes(key)) {
        keys.push(key);
        included.push(resource);
        newData.push(datum);
       }
      })
    );
    if (newData.length > 0 && newRelators) {
     newQueue.push([newData, Object.values(newRelators)]);
    }
   }
  }
  mainQueue.push(newQueue);
 }
 return included;
}

export function normalizeRelators<T>(relators: SerializerOptions<T>["relators"]) {
 const normalizedRelators: Record<string, Relator<T>> = {};
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

export class Helpers<PrimaryType> {
 public projectAttributes: (data: PrimaryType) => Partial<PrimaryType> | undefined;
 public relators: Record<string, Relator<PrimaryType, any>> | undefined;
 public constructor(options: SerializerOptions<PrimaryType>) {
  // Relators
  this.relators = normalizeRelators(options.relators);

  // Projection
  if (options.projection === undefined) {
   this.projectAttributes = () => undefined;
  } else if (options.projection === null) {
   this.projectAttributes = (data: PrimaryType) => {
    const attributes = Object.assign({}, data);
    delete attributes[options.idKey];
    return attributes;
   };
  } else {
   type PrimaryKeys = Array<keyof PrimaryType>;
   const projection = options.projection;
   const type = Object.values(projection)[0];
   if (type === 0) {
    this.projectAttributes = (data: PrimaryType) => {
     const keys = Object.keys(data) as PrimaryKeys;
     const attributes: Partial<PrimaryType> = {};
     for (let i = 0, len = keys.length; i < len; i++) {
      if (!(keys[i] in projection)) {
       attributes[keys[i]] = data[keys[i]];
      }
     }
     delete attributes[options.idKey];
     return attributes;
    };
   } else {
    const keys = Object.keys(projection) as PrimaryKeys;
    this.projectAttributes = (data: PrimaryType) => {
     const attributes: Partial<PrimaryType> = {};
     for (let i = 0, len = keys.length; i < len; i++) {
      attributes[keys[i]] = data[keys[i]];
     }
     delete attributes[options.idKey];
     return attributes;
    };
   }
  }
 }
}
