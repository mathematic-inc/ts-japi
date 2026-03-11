import type { ErrorDocument } from "../interfaces/json-api.interface";
import JapiError from "../models/error.model";
import { isPlainObject } from "./is-plain-object";

/**
 * Detects an `ErrorDocument` like object
 *
 * @param document - An unknown object
 */
export function isErrorDocument(document: unknown): document is ErrorDocument {
  return (
    isPlainObject(document) &&
    Array.isArray(document.errors) &&
    ("jsonapi" in document ||
      document.errors.every((error) =>
        error instanceof JapiError ? true : JapiError.isLikeJapiError(error)
      ))
  );
}
