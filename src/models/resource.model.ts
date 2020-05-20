import { LinkObject } from "../interfaces/document.interface";
import { ResourceOptions } from "../interfaces/resource.interface";
import { Dictionary } from "../types/global.types";
import BaseResource from "./base-resource.model";
import Meta from "./meta.model";
import Relationships from "./relationships.model";

export default class Resource<T = Dictionary<any>> extends BaseResource {
 public attributes?: Partial<T>;
 public relationships?: Relationships;
 public links?: LinkObject;
 public constructor(options: ResourceOptions<T>, meta?: Meta) {
  super(options.type, options.id, meta);
  if (options.attributes) this.attributes = options.attributes;
  if (options.relationships) this.relationships = options.relationships;
  if (options.links) this.links = options.links;
 }
}
