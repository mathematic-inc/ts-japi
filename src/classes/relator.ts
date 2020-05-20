import { ResourceLinkage } from "../interfaces/document.interface";
import { RelatorOptions } from "../interfaces/relator.interface";
import Link from "../models/link.model";
import Meta from "../models/meta.model";
import Relationship from "../models/relationship.model";
import { Dictionary, SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";
import Serializer from "./serializer";

/**
 * The {@linkcode Relator} class is used to generate top-level [included data](https://jsonapi.org/format/#document-top-level)
 * as well as resource-level [relationships](https://jsonapi.org/format/#document-resource-object-relationships).
 *
 * Example:
 * ```typescript
 * [[include:relator.example.ts]]
 * ```
 */
export default class Relator<PrimaryType, RelatedType extends Dictionary<any> = any> {
 /**
  * Default options. Can be edited to change default options globally.
  */
 public static defaultOptions = {
  linkers: {},
  serializer: new Serializer("related_data"),
 };

 /**
  * Options for relator.
  */
 private options: RelatorOptions<PrimaryType, RelatedType>;

 /**
  * Creates a {@linkcode Relator}.
  *
  * @param fetch Fetches related data from primary data.
  * @param options Options for the relator.
  */
 public constructor(
  fetch: (data: PrimaryType) => Promise<SingleOrArray<RelatedType>>,
  options: Partial<RelatorOptions<PrimaryType, RelatedType>> = {}
 ) {
  // Setting default options
  this.options = merge({}, Relator.defaultOptions, options);
  this.getRelatedData = fetch;
 }

 /** @internal  Gets related data from primary data. */
 public getRelatedData: (data: PrimaryType) => Promise<SingleOrArray<RelatedType>>;

 /** @internal Gets the related resources {@linkcode Serializer}. */
 public getRelatedSerializer() {
  return this.options.serializer;
 }

 /** @internal Creates a {@linkcode Relationship}. */
 public async getRelationship(data: PrimaryType) {
  // Get options.
  const { serializer, linkers, metaizer } = this.options;

  // Get related data.
  const relatedData = await this.getRelatedData(data);

  // Get related links.
  let links: Dictionary<Link> | undefined;
  if (linkers.relationship) {
   links = { ...links, self: linkers.relationship.link(data, relatedData) };
  }
  if (linkers.related) {
   links = { ...links, related: linkers.related.link(data, relatedData) };
  }

  // Construct related resources.
  let resourceLinkage: ResourceLinkage | undefined;
  if (serializer) {
   resourceLinkage = Array.isArray(relatedData)
    ? relatedData.map((data) => serializer.createIdentifier(data))
    : serializer.createIdentifier(relatedData);
  }

  // Get meta.
  let meta: Meta | undefined;
  if (metaizer) {
   meta = metaizer.metaize(data, relatedData);
  }

  return new Relationship({ links, data: resourceLinkage }, meta);
 }
}
