import Meta from "./meta.model";

export default abstract class BaseResource {
 public type?: string;
 public id?: string;
 public meta?: Meta;
 public constructor(type?: string, id?: string, meta?: Meta) {
  if (type) this.type = type;
  if (id) this.id = id;
  if (meta) this.meta = meta;
 }
}
