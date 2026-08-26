import Relator from "../classes/relator";
import type { SerializerOptions } from "../interfaces/serializer.interface";
import type { Dictionary } from "../types/global.types";

async function recurseRelatorsDepth(
  data: any[],
  relators: Record<string, Relator<any>>,
  depth: number,
  keys: string[],
  relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>,
) {
  const included: any[] = [];

  let curRelatorDataCache = relatorDataCache || new Map<Relator<any>, Dictionary<any>[]>();

  // Required to support backwards compatibility where the first dataCache may
  // not be passed in. All subsequent iterations will contain a dataCache
  if (!relatorDataCache && depth > 0) {
    for (const relator of Object.values(relators)) {
      const cache = curRelatorDataCache.get(relator) || [];
      curRelatorDataCache.set(relator, cache);
      for (const datum of data) {
        const relatedData = await relator.getRelatedData(datum);
        if (relatedData !== null) {
          cache.push(...(Array.isArray(relatedData) ? relatedData : [relatedData]));
        }
      }
    }
  }

  let remainingDepth = depth;
  while (remainingDepth-- > 0 && curRelatorDataCache.size > 0) {
    const newRelatorDataCache = new Map<Relator<any>, Dictionary<any>[]>();

    for (const [relator, cache] of curRelatorDataCache) {
      for (const item of cache) {
        const resource = await relator.getRelatedResource(
          item,
          undefined,
          undefined,
          newRelatorDataCache,
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
  relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>,
) {
  if (include === undefined || typeof include === "number") {
    const depth = typeof include === "number" ? include : 0;
    return recurseRelatorsDepth(data, relators, depth, keys, relatorDataCache);
  }

  const included: any[] = [];

  let curRelatorDataCache = relatorDataCache || new Map<Relator<any>, Dictionary<any>[]>();

  // Required to support backwards compatibility where the first dataCache may
  // not be passed in. All subsequent iterations will contain a dataCache
  if (!relatorDataCache && include.length > 0) {
    for (const relator of Object.values(relators)) {
      const cache = curRelatorDataCache.get(relator) || [];
      curRelatorDataCache.set(relator, cache);
      for (const datum of data) {
        const relatedData = await relator.getRelatedData(datum);
        if (relatedData !== null) {
          cache.push(...(Array.isArray(relatedData) ? relatedData : [relatedData]));
        }
      }
    }
  }

  const maxDepth = Math.max(...include.map((i) => i.split(".").length));

  let currentDepth = 0;
  while (currentDepth < maxDepth) {
    const newRelatorDataCache = new Map<Relator<any>, Dictionary<any>[]>();

    const includeFields = include
      .map((i) => i.split("."))
      .flatMap((fields) => {
        const field = fields[currentDepth];
        return field ? [{ field, hasMore: fields.length > currentDepth + 1 }] : [];
      })
      .reduce(
        (acc, i) => {
          const match = acc.find((j) => j.field === i.field);
          if (match) {
            match.hasMore = match.hasMore || i.hasMore;
          } else {
            acc.push(i);
          }
          return acc;
        },
        [] as { field: string; hasMore: boolean }[],
      );

    for (const [relator, cache] of curRelatorDataCache) {
      const shouldBuildRelatedCache: boolean =
        (!includeFields ||
          includeFields?.filter((i) => i.field === relator.relatedName)?.some((i) => i.hasMore)) ??
        false;

      for (const cacheItem of cache) {
        // Include if,
        // - includeFields !== undefined
        // - includeFields has entry where field = relatedName
        if (!includeFields || includeFields.map((i) => i.field).includes(relator.relatedName)) {
          const key = `${relator.serializer.collectionName}:${
            cacheItem[relator.serializer.getIdKeyFieldName()] as string
          }`;
          if (!keys.includes(key)) {
            // const key = resource.getKey();
            const resource = await relator.getRelatedResource(
              cacheItem,
              undefined,
              undefined,
              // Only build the cache for the next iteration if needed.
              shouldBuildRelatedCache ? newRelatorDataCache : undefined,
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
  relators: SerializerOptions<T>["relators"],
) {
  const normalizedRelators: Record<string, Relator<T>> = {};
  if (relators) {
    if (relators instanceof Relator) {
      normalizedRelators[relators.relatedName] = relators;
      return normalizedRelators;
    }
    if (Array.isArray(relators)) {
      for (const relator of relators) {
        normalizedRelators[relator.relatedName] = relator;
      }
      return normalizedRelators;
    }
    return relators;
  }
  return;
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
      const relatorKeys = this.relators ? new Set(Object.keys(this.relators)) : undefined;
      this.projectAttributes = (data: PrimaryType) => {
        const attributes = { ...data };
        delete attributes[options.idKey];
        if (relatorKeys) {
          for (const key of relatorKeys) {
            delete attributes[key as keyof PrimaryType];
          }
        }
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
          for (const key of keys) {
            if (!(key in projection)) {
              attributes[key] = data[key];
            }
          }
          delete attributes[options.idKey];
          return attributes;
        };
      } else {
        const keys = Object.keys(projection) as PrimaryKeys;
        this.projectAttributes = (data: PrimaryType) => {
          const attributes: Partial<PrimaryType> = {};
          for (const key of keys) {
            attributes[key] = data[key];
          }
          delete attributes[options.idKey];
          return attributes;
        };
      }
    }
  }
}
