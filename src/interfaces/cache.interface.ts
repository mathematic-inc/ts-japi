import { SingleOrArray, nullish } from "../types/global.types";

export interface CacheOptions<DataType> {
 /**
  * The maximum amount of documents that can be stored before erasure.
  *
  * @default `10`
  */
 limit: number;

 /**
  * The method to use in determining data equality
  *
  * @default `Object.is`
  */
 resolver(
  storedData: SingleOrArray<DataType> | nullish,
  newData: SingleOrArray<DataType> | nullish
 ): boolean;
}
