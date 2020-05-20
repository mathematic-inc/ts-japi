import Link from "../models/link.model";
import Relationships from "../models/relationships.model";
import { Dictionary } from "../types/global.types";

/** @internal */
export interface ResourceOptions<T> {
 id?: string;
 type?: string;
 attributes?: Partial<T>;
 relationships?: Relationships;
 links?: Dictionary<Link>;
}
