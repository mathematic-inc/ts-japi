import { LinkObject, ResourceLinkage } from "../interfaces/document.interface";
import Meta from "./meta.model";

interface RelationshipsOptions {
 links?: LinkObject;
 data?: ResourceLinkage;
}

export default class Relationships {
 public links?: LinkObject;
 public data?: ResourceLinkage;
 public meta?: Meta;
 public constructor(options: RelationshipsOptions, meta?: Meta) {
  if (options.links) this.links = options.links;
  if (options.data) this.data = options.data;
  if (meta) this.meta = meta;
  if (!this.links && !this.data && !this.meta) {
   throw new Error(
    "Relationships must contain at least a link, data, or meta. See https://jsonapi.org/format/#document-resource-object-relationships for more information."
   );
  }
 }
}