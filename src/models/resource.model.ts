import { LinkObject } from "../interfaces/document.interface";
import Link from "../models/link.model";
import { Dictionary } from "../types/global.types";
import Meta from "./meta.model";
import Relationship from "./relationship.model";
import ResourceIdentifier, { ResourceIdentifierOptions } from "./resource-identifier.model";

/** @internal */
export interface ResourceOptions<T> extends ResourceIdentifierOptions {
 attributes?: Partial<T>;
 relationships?: Relationship;
 links?: Dictionary<Link>;
}

export default class Resource<T = Dictionary<any>> extends ResourceIdentifier {
 public attributes?: Partial<T>;
 public links?: LinkObject;
 public relationships?: Relationship;
 public constructor(options: ResourceOptions<T>, meta?: Meta) {
  super({ id: options.id, type: options.type }, meta);
  if (options.attributes) this.attributes = options.attributes;
  if (options.relationships) this.relationships = options.relationships;
  if (options.links) this.links = options.links;
 }
}
