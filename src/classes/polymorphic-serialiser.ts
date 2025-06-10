import { DataDocument } from '../interfaces/json-api.interface';
import { SerializerOptions } from '../interfaces/serializer.interface';
import ResourceIdentifier from '../models/resource-identifier.model';
import Resource from '../models/resource.model';
import { Dictionary, nullish, SingleOrArray } from '../types/global.types';
import { Helpers } from '../utils/serializer.utils';
import Relator from './relator';
import Serializer from './serializer';

export default class PolymorphicSerializer<
  PrimaryType extends Dictionary<any>
> extends Serializer<PrimaryType> {
  private serialisers: Record<string, Serializer> | Record<string, () => Serializer>;

  private key: keyof PrimaryType;

  public constructor(
    commonName: string,
    key: keyof PrimaryType,
    serializers: Record<string, Serializer>
  );
  public constructor(
    commonName: string,
    key: keyof PrimaryType,
    serializers: Record<string, () => Serializer>
  );
  public constructor(
    commonName: string,
    key: keyof PrimaryType,
    serializers: Record<string, Serializer> | Record<string, () => Serializer>
  ) {
    super(commonName);
    this.serialisers = serializers;
    this.key = key;
  }

  public async serialize(
    data: SingleOrArray<PrimaryType> | nullish,
    options?: Partial<SerializerOptions<PrimaryType>>
  ): Promise<Partial<DataDocument<PrimaryType>>> {
    if (Array.isArray(data)) {
      const documents = await Promise.all(
        Object.values(
          data.reduce((acc, d) => {
            // group data by type
            const type = d[this.key];
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(d);
            return acc;
          }, {} as Record<keyof PrimaryType, PrimaryType[]>)
        ).map((d) => {
          return this.serializeType(d, options);
        })
      );

      // Construct initial document and included data
      let document: Partial<DataDocument<PrimaryType>> = {
        data: [],
      };

      // Document versioning
      if (options?.version) {
        document.jsonapi = { ...document.jsonapi, version: options.version };
      }

      if (options?.metaizers?.jsonapi) {
        document.jsonapi = { ...document.jsonapi, meta: options.metaizers.jsonapi.metaize() };
      }

      document = documents.reduce((result, document) => {
        result.data = [result.data ?? [], document.data ?? []].flat();
        result.included = [result.included ?? [], document.included ?? []].flat();

        return result;
      }, document);

      // Sort data to match input order - this is important for cases where
      // data has been sorted prior to serialization.
      if (Array.isArray(document.data)) {
        document.data = document.data.sort((a, b) => {
          const aIndex = data.findIndex((datum) => datum.id === a.id);
          const bIndex = data.findIndex((datum) => datum.id === b.id);

          return aIndex - bIndex;
        });
      }

      // Handle meta
      if (options?.metaizers?.document) {
        document.meta = options.metaizers.document.metaize(data);
      }

      // Handle links
      if (options?.linkers) {
        if (options.linkers.document) {
          document.links = { ...document.links, self: options.linkers.document.link(data) };
        }
        if (options.linkers.paginator) {
          const pagination = options.linkers.paginator.paginate(
            data as PrimaryType | PrimaryType[]
          );
          if (pagination) {
            document.links = { ...document.links, ...pagination };
          }
        }
      }

      return document;
    } else if (data) {
      return this.serializeType(data, options);
    }

    const serialiser = Object.values(this.serialisers)[0];
    if (typeof serialiser === 'function') {
      return serialiser().serialize(data, options);
    }
    return serialiser.serialize(data, options);
  }

  public createIdentifier(
    data: PrimaryType,
    options?: SerializerOptions<PrimaryType>
  ): ResourceIdentifier {
    const serializer = this.getSerializerForData(data);
    if (serializer) {
      return serializer.createIdentifier(data, options);
    }
    return super.createIdentifier(data, options);
  }

  public async createResource(
    data: PrimaryType,
    options?: Partial<SerializerOptions<PrimaryType>>,
    helpers?: Helpers<PrimaryType>,
    relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>
  ): Promise<Resource<PrimaryType>> {
    const serializer = this.getSerializerForData(data);
    if (serializer) {
      return serializer.createResource(data, options, helpers, relatorDataCache);
    }
    return super.createResource(data, options, helpers, relatorDataCache);
  }

  private async serializeType<T extends PrimaryType>(
    data: SingleOrArray<T>,
    options?: Partial<SerializerOptions<T>>
  ) {
    const serializer = this.getSerializerForData(Array.isArray(data) ? data[0] : data);
    if (serializer) {
      return serializer.serialize(data, options);
    }
    return super.serialize(data, options);
  }

  private getSerializerForData(data: PrimaryType): Serializer | null {
    const serialiser = this.serialisers[data[this.key]];
    if (serialiser) {
      if (typeof serialiser === 'function') {
        return serialiser();
      }
      return serialiser;
    }

    return null;
  }
}
