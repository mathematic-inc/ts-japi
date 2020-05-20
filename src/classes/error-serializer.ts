import { ErrorSerializerOptions } from "../interfaces/error-serializer.interface";
import { ErrorDocument } from "../interfaces/document.interface";
import JAPIError from "../models/error.model";
import { SingleOrArray, Dictionary } from "../types/global.types";
import merge from "../utils/merge";

/**
 * The {@linkcode ErrorSerializer} class is used to serialize errors.
 *
 * Example:
 * ```typescript
 * [[include:error-serializer.example.ts]]
 * ```
 */
export default class ErrorSerializer<T extends Dictionary<any>> {
 /**
  * Default options. Can be edited to change default options globally.
  */
 public static defaultOptions = {
  version: "1.0",
  attributes: {
   id: "id",
   status: "code",
   code: "name",
   title: "reason",
   detail: "message",
   source: {
    pointer: "location",
    parameter: undefined,
   },
  },
  metaizers: {},
  linkers: {},
 };

 /**
  * The set of options for the serializer.
  */
 private options: Readonly<ErrorSerializerOptions<T>>;

 /**
  * Creates a {@linkcode Serializer}.
  *
  * @param collectionName The name of the collection of objects.
  * @param options Options for the serializer.
  */
 public constructor(options: Partial<ErrorSerializerOptions<T>> = {}) {
  // Setting default options.
  this.options = merge({}, ErrorSerializer.defaultOptions, options);
 }

 /**
  * The actual serialization function.
  *
  * @param errors Errors to serialize.
  * @param options Options to use at runtime.
  */
 public serialize(errors: SingleOrArray<T>, options: Partial<ErrorSerializerOptions<T>> = {}) {
  // Get options.
  const opts = merge({}, this.options, options);
  const attributes = opts.attributes;
  const linkers = opts.linkers;
  const metaizers = opts.metaizers;
  const version = opts.version;

  const document: ErrorDocument = {};

  // Normalize error input
  if (!Array.isArray(errors)) {
   errors = [errors];
  }
  document.errors = errors.map((error) =>
   error instanceof JAPIError
    ? error
    : new JAPIError({
       id: attributes.id && error[attributes.id],
       status: attributes.status && error[attributes.status],
       code: attributes.code && error[attributes.code],
       title: attributes.title && error[attributes.title],
       detail: attributes.detail && error[attributes.detail],
       source: (() => {
        const source: any = {};
        if (attributes.source.pointer && error[attributes.source.pointer]) {
         source.pointer = error[attributes.source.pointer];
        }
        if (attributes.source.parameter && error[attributes.source.parameter]) {
         source.parameter = error[attributes.source.parameter];
        }
        return Object.keys(source).length > 0 ? source : undefined;
       })(),
      })
  );

  // Constructing base document.
  document.jsonapi = { version };

  // Handling document metadata.
  if (metaizers.jsonapi) {
   document.jsonapi.meta = metaizers.jsonapi.metaize();
  }
  if (metaizers.document) {
   document.meta = metaizers.document.metaize(document.errors);
  }
  if (metaizers.error) {
   for (const error of document.errors) {
    error.meta = metaizers.error.metaize(error);
   }
  }

  // Handling links.
  if (Object.keys(linkers).length > 0) {
   for (const [key, linker] of Object.entries(linkers)) {
    if (linker) {
     for (const error of document.errors) {
      error.links = { ...error.links, [key]: linker.link(error) };
     }
    }
   }
  }

  return document;
 }
}
