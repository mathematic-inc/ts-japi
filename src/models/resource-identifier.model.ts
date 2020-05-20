import BaseResource from "./base-resource.model";
import Meta from "./meta.model";

export interface ResourceIdentifierOptions {
 type: string;
 id: string;
}

export default class ResourceIdentifier extends BaseResource {
 public type: string;
 public id: string;
 public constructor(options: ResourceIdentifierOptions, meta?: Meta) {
  super(options.type, options.id, meta);
  this.type = options.type;
  this.id = options.id;
 }
}
