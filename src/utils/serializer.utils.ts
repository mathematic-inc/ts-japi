import Relator from '../classes/relator';
import { SerializerOptions } from '../interfaces/serializer.interface';
import { Dictionary } from '../types/global.types';

async function recurseRelatorsDepth(
  data: any[],
  relators: Record<string, Relator<any>>,
  depth: number,
  keys: string[],
  relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>
) {
  const included: any[] = [];

  let curRelatorDataCache = relatorDataCache || new Map<Relator<any>, Dictionary<any>[]>();

  // Required to support backwards compatability where the first dataCache may
  // not be passed in. All subsequent iterations will contain a dataCache
  if (!relatorDataCache && depth > 0) {
    for (const name in relators) {
      const cache = curRelatorDataCache.get(relators[name]) || [];
      curRelatorDataCache.set(relators[name], cache);
      for (const datum of data) {
        const relatedData = await relators[name].getRelatedData(datum);
        if (relatedData !== null) {
          cache.push(...(Array.isArray(relatedData) ? relatedData : [relatedData]));
        }
      }
    }
  }

  while (depth-- > 0 && curRelatorDataCache.size > 0) {
    const newRelatorDataCache = new Map<Relator<any>, Dictionary<any>[]>();

    for (const [relator, cache] of curRelatorDataCache) {
      for (let i = 0; i < cache.length; i++) {
        const resource = await relator.getRelatedResource(
          cache[i],
          undefined,
          undefined,
          newRelatorDataCache
        );

        const key = resource.getKey();
        if (!keys.includes(key)) {
          keys.push(key);
          included.push(resource);
        }
      }
    }

    curRelatorDataCache = newRelatorDataCache;
  }

  return included;
}

export async function recurseRelators(
  data: any[],
  relators: Record<string, Relator<any>>,
  include: number | string[] | undefined,
  keys: string[],
  relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>
) {
  if (include === undefined || typeof include === 'number') {
    return recurseRelatorsDepth(data, relators, include ?? 0, keys, relatorDataCache);
  }

  const included: any[] = [];

  let curRelatorDataCache = relatorDataCache || new Map<Relator<any>, Dictionary<any>[]>();

  // Required to support backwards compatability where the first dataCache may
  // not be passed in. All subsequent iterations will contain a dataCache
  if (!relatorDataCache && include.length > 0) {
    for (const name in relators) {
      const cache = curRelatorDataCache.get(relators[name]) || [];
      curRelatorDataCache.set(relators[name], cache);
      for (const datum of data) {
        const relatedData = await relators[name].getRelatedData(datum);
        if (relatedData !== null) {
          cache.push(...(Array.isArray(relatedData) ? relatedData : [relatedData]));
        }
      }
    }
  }

  const maxDepth = Math.max(...include.map((i) => i.split('.').length));

  let currentDepth = 0;
  while (currentDepth < maxDepth) {
    const newRelatorDataCache = new Map<Relator<any>, Dictionary<any>[]>();

    const includeFields: { field: string | undefined; hasMore: boolean }[] | undefined = include
      .map((i) => i.split('.'))
      .filter((i) => i[currentDepth])
      .map((i) => ({ field: i[currentDepth], hasMore: i.length > currentDepth + 1 }))
      .reduce((acc, i) => {
        const match = acc.find((j) => j.field === i.field);
        if (match) {
          match.hasMore = match.hasMore || i.hasMore;
        } else {
          acc.push(i);
        }
        return acc;
      }, [] as { field: string; hasMore: boolean }[]);

    for (const [relator, cache] of curRelatorDataCache) {
      const shouldBuildRelatedCache: boolean =
        (!includeFields ||
          includeFields?.filter((i) => i.field === relator.relatedName)?.some((i) => i.hasMore)) ??
        false;

      for (let i = 0; i < cache.length; i++) {
        // Include if,
        // - includeFields !== undefined
        // - includeFields has entry where field = relatedName
        if (!includeFields || includeFields.map((i) => i.field).includes(relator.relatedName)) {
          const key = `${relator.serializer.collectionName}:${cache[i].id as string}`;
          if (!keys.includes(key)) {
            // const key = resource.getKey();
            const resource = await relator.getRelatedResource(
              cache[i],
              undefined,
              undefined,
              // Only build the cache for the next iteration if needed.
              shouldBuildRelatedCache ? newRelatorDataCache : undefined
            );
            keys.push(key);
            included.push(resource);
          }
        }
      }
    }

    currentDepth++;
    curRelatorDataCache = newRelatorDataCache;
  }

  return included;
}

export function normalizeRelators<T extends Dictionary<any>>(
  relators: SerializerOptions<T>['relators']
) {
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

export class Helpers<PrimaryType extends Dictionary<any> = any> {
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
