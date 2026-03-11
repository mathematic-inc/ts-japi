import type { Dictionary, nullish } from "..";
import type { ResourceLinkage } from "../interfaces/json-api.interface";
import type Link from "./link.model";
import type Meta from "./meta.model";

/** @internal */
export interface RelationshipOptions {
  data?: ResourceLinkage;
  links?: Dictionary<Link | nullish>;
  meta?: Meta;
}

export default class Relationship {
  public links?: Dictionary<Link | nullish>;
  public data?: ResourceLinkage;
  public meta?: Meta;
  public constructor(options: RelationshipOptions) {
    // data can be explicitly set to null for empty to-one relationships
    if (typeof options.data !== "undefined") {
      this.data = options.data;
    }

    if (options.links) {
      this.links = options.links;
    }
    if (options.meta) {
      this.meta = options.meta;
    }
    if (typeof options.data === "undefined" && !this.links && !this.meta) {
      throw new Error(
        "Relationships must contain at least a link, data, or meta. See https://jsonapi.org/format/#document-resource-object-relationships for more information."
      );
    }
  }
}
