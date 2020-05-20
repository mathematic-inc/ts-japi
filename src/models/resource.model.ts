import Link from "../models/link.model";
import { Dictionary, nullish } from "../types/global.types";
import Relationship from "./relationship.model";
import ResourceIdentifier, { ResourceIdentifierOptions } from "./resource-identifier.model";

/** @internal */
export interface ResourceOptions<T> extends ResourceIdentifierOptions {
 attributes?: Partial<T>;
 relationships?: Record<string, Relationship>;
 links?: Dictionary<Link>;
}

export default class Resource<T = Dictionary<any>> extends ResourceIdentifier {
 public attributes?: Partial<T>;
 public links?: Dictionary<Link | nullish>;
 public relationships?: Record<string, Relationship>;
 public constructor(id: string, type: string, options: ResourceOptions<T>) {
  super(id, type, options);
  if (options.attributes) this.attributes = options.attributes;
  if (options.relationships) this.relationships = options.relationships;
  if (options.links) this.links = options.links;
 }
}
