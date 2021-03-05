import Meta from './meta.model';

/** @internal */
export interface ResourceIdentifierOptions {
  meta?: Meta;
}

export default class ResourceIdentifier {
  public type: string;
  public id: string;
  public meta?: Meta;
  public constructor(id: string, type: string, options: ResourceIdentifierOptions) {
    this.type = type;
    this.id = id;
    if (options.meta) this.meta = options.meta;
  }
  public getKey() {
    return `[${this.type}:${this.id}]`;
  }
}
