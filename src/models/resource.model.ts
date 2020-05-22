import { LinkObject } from "../interfaces/document.interface";
import { ResourceOptions } from "../interfaces/resource.interface";
import { Dictionary } from "../types/global.types";
import Meta from "./meta.model";
import Relationship from "./relationship.model";
import ResourceIdentifier from "./resource-identifier.model";

export default class Resource<T = Dictionary<any>> extends ResourceIdentifier {
 public attributes?: Partial<T>;
 public relationships?: Relationship;
 public links?: LinkObject;
 public constructor(options: ResourceOptions<T>, meta?: Meta) {
  super({ id: options.id, type: options.type }, meta);
  if (options.attributes) this.attributes = options.attributes;
  if (options.relationships) this.relationships = options.relationships;
  if (options.links) this.links = options.links;
 }
}
