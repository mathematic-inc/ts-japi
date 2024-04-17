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
  private serialisers: Record<string, Serializer>;

  private key: keyof PrimaryType;

  public constructor(
    commonName: string,
    key: keyof PrimaryType,
    serializers: Record<string, Serializer>
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

      return documents.reduce((result, document) => {
        if (!result) {
          return document;
        }

        result.data = [result.data ?? [], document.data ?? []].flat();
        result.included = [result.included ?? [], document.included ?? []].flat();

        return result;
      });
    } else if (data) {
      return this.serializeType(data, options);
    }

    return Object.values(this.serialisers)[0].serialize(data, options);
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
    if (this.serialisers[data[this.key]]) {
      return this.serialisers[data[this.key]];
    }

    return null;
  }
}
