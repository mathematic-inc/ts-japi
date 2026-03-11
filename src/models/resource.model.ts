import type Link from "../models/link.model";
import type { Dictionary, nullish } from "../types/global.types";
import type Relationship from "./relationship.model";
import ResourceIdentifier, {
  type ResourceIdentifierOptions,
} from "./resource-identifier.model";

/** @internal */
export interface ResourceOptions<T> extends ResourceIdentifierOptions {
  attributes?: Partial<T>;
  links?: Dictionary<Link>;
  relationships?: Record<string, Relationship>;
}

export default class Resource<T = Dictionary<any>> extends ResourceIdentifier {
  public attributes?: Partial<T>;
  public links?: Dictionary<Link | nullish>;
  public relationships?: Record<string, Relationship>;
  public constructor(id: string, type: string, options: ResourceOptions<T>) {
    super(id, type, options);
    if (options.attributes) {
      this.attributes = options.attributes;
    }
    if (options.relationships) {
      this.relationships = options.relationships;
    }
    if (options.links) {
      this.links = options.links;
    }
  }
}
