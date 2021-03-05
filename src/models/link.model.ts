import { URL } from 'url';
import Meta from './meta.model';

export default class Link {
  public url: URL;
  public meta?: Meta;
  public constructor(href: string, meta?: Meta) {
    this.url = new URL(href);
    this.meta = meta;
  }
  public toJSON = this.toString.bind(this);
  public toString() {
    return this.meta ? { href: this.url.href, meta: this.meta } : this.url.href;
  }
}
