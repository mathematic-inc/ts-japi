import type JapiError from "../models/error.model";
import type Link from "../models/link.model";
import type Meta from "../models/meta.model";
import type Resource from "../models/resource.model";
import type ResourceIdentifier from "../models/resource-identifier.model";
import type { Dictionary, nullish, SingleOrArray } from "../types/global.types";
import type { PaginationOf } from "./paginator.interface";

export interface DataDocument<PrimaryType extends Dictionary<any>>
  extends Partial<MetaDocument> {
  data: PrimaryData<PrimaryType>;
  included?: Resource[];
  links?: Dictionary<Link | nullish> | PaginationOf<Link>;
}

export interface ErrorDocument extends Partial<MetaDocument> {
  errors: JapiError[];
}

export interface JSONAPIObject {
  meta?: Meta;
  version?: string;
}

export interface MetaDocument extends BaseDocument {
  meta: Meta;
}

export interface BaseDocument {
  jsonapi?: JSONAPIObject;
}

export type PrimaryData<T> =
  | SingleOrArray<ResourceIdentifier>
  | SingleOrArray<Resource<T>>
  | null;

export type ResourceLinkage = SingleOrArray<ResourceIdentifier> | null;
