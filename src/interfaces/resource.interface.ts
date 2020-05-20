import Link from "../models/link.model";
import Relationship from "../models/relationship.model";
import { Dictionary } from "../types/global.types";

/** @internal */
export interface ResourceOptions<T> {
 id: string;
 type: string;
 attributes?: Partial<T>;
 relationships?: Relationship;
 links?: Dictionary<Link>;
}

/** @internal */
export interface ResourceIdentifierOptions {
 type: string;
 id: string;
}
