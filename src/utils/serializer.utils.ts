import Relator from "../classes/relator";
import { SerializerOptions } from "../interfaces/serializer.interface";

export async function recurseRelators(
 data: any[],
 relators: Record<string, Relator<any>>,
 depth: number,
 keys: string[]
) {
 const included: any[] = [];
 const queue: [any[], Record<string, Relator<any>>][] = [[data, relators]];
 while (queue.length > 0 && depth-- > 0) {
  for (let i = 0, len = queue.length; i < len; i++) {
   const [data, relators] = queue[i];
   for (const relator of Object.values(relators)) {
    const relatedData = await Promise.all(data.map(relator.getRelatedData));
    const newData: any[] = [];
    const newRelators = relator.getRelatedRelators();
    await Promise.all(
     relatedData.flat().map(async (datum) => {
      const resource = await relator.getRelatedResource(datum);
      const key = resource.getKey();
      if (!keys.includes(key)) {
       included.push(resource);
       keys.push(key);
      }
     })
    );
    if (newData.length > 0 && newRelators) {
     queue.push([newData, newRelators]);
    }
   }
  }
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
