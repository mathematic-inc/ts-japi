import JapiError from '../models/error.model';
import Link from '../models/link.model';
import Meta from '../models/meta.model';
import ResourceIdentifier from '../models/resource-identifier.model';
import Resource from '../models/resource.model';
import { Dictionary, SingleOrArray, nullish } from '../types/global.types';
import { PaginationOf } from './paginator.interface';

export interface DataDocument<PrimaryType extends Dictionary<any>> extends Partial<MetaDocument> {
  links?: Dictionary<Link | nullish> | PaginationOf<Link>;
  included?: Resource[];
  data: PrimaryData<PrimaryType>;
}

export interface ErrorDocument extends Partial<MetaDocument> {
  errors: JapiError[];
}

export interface JSONAPIObject {
  version?: string;
  meta?: Meta;
}

export interface MetaDocument extends BaseDocument {
  meta: Meta;
}

export interface BaseDocument {
  jsonapi?: JSONAPIObject;
}

export type PrimaryData<T> = SingleOrArray<ResourceIdentifier> | SingleOrArray<Resource<T>> | null;

export type ResourceLinkage = SingleOrArray<ResourceIdentifier> | null;
