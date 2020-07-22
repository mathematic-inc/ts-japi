import { ErrorSerializerOptions } from "../interfaces/error-serializer.interface";
import { ErrorOptions } from "../interfaces/error.interface";
import { ErrorDocument } from "../interfaces/json-api.interface";
import JapiError from "../models/error.model";
import { SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";

/**
 * The {@linkcode ErrorSerializer} class is used to serialize errors.
 *
 * Example:
 * ```typescript
 * [[include:error-serializer.example.ts]]
 * ```
 */
export default class ErrorSerializer<ErrorType> {
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
 private options: Readonly<ErrorSerializerOptions<ErrorType>>;

 /**
  * Creates a {@linkcode Serializer}.
  *
  * @param collectionName The name of the collection of objects.
  * @param options Options for the serializer.
  */
 public constructor(options: Partial<ErrorSerializerOptions<ErrorType>> = {}) {
  // Setting default options.
  this.options = merge({}, ErrorSerializer.defaultOptions, options);
 }

 /**
  * The actual serialization function.
  *
  * @param errors Errors to serialize.
  * @param options Options to use at runtime.
  */
 public serialize(
  errors: SingleOrArray<ErrorType>,
  options?: Partial<ErrorSerializerOptions<ErrorType>>
 ) {
  // Get options.
  let o = this.options;
  if (options) o = merge({}, this.options, options);

  const attributes = o.attributes;
  const linkers = o.linkers;
  const metaizers = o.metaizers;
  const version = o.version;

  const document: ErrorDocument = { errors: [] };

  // Normalize error input
  if (!Array.isArray(errors)) {
   errors = [errors];
  }
  document.errors = errors.map((e) => {
   if (e instanceof JapiError) return e;
   const eo: ErrorOptions = {};
   if (attributes.id && e[attributes.id]) {
    eo.id = String(e[attributes.id]);
   }
   if (attributes.status && e[attributes.status]) {
    eo.status = String(e[attributes.status]);
   }
   if (attributes.code && e[attributes.code]) {
    eo.code = String(e[attributes.code]);
   }
   if (attributes.title && e[attributes.title]) {
    eo.title = String(e[attributes.title]);
   }
   if (attributes.detail && e[attributes.detail]) {
    eo.detail = String(e[attributes.detail]);
   }
   if (attributes.source) {
    eo.source = {};
    if (attributes.source.pointer && e[attributes.source.pointer]) {
     eo.source.pointer = String(e[attributes.source.pointer]);
    }
    if (attributes.source.parameter && e[attributes.source.parameter]) {
     eo.source.parameter = String(e[attributes.source.parameter]);
    }
    if (Object.keys(eo.source).length === 0) {
     delete eo.source;
    }
   }
   return new JapiError(eo);
  });

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
