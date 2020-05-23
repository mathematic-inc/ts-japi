import Meta from "./meta.model";

/** @internal */
export interface ResourceIdentifierOptions {
 type: string;
 id: string;
}

export default class ResourceIdentifier {
 public type: string;
 public id: string;
 public meta?: Meta;
 public constructor(options: ResourceIdentifierOptions, meta?: Meta) {
  this.type = options.type;
  this.id = options.id;
  if (meta) this.meta = meta;
 }
 public getKey() {
  return `[${this.type}:${this.id}]`;
 }
}
